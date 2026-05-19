import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development-only",
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const { pathname } = request.nextUrl;

  const legacyRouteMap: Record<string, string> = {
    "/account": "/conta",
    "/activate": "/ativar",
    "/admin/brands": "/administracao/marcas",
    "/admin/card-requests": "/administracao/solicitacoes-cartao",
    "/admin/events": "/administracao/eventos",
    "/admin/premium-orders": "/administracao/pedidos-premium",
    "/admin/products": "/administracao/produtos",
    "/admin/reports": "/administracao/relatorios",
    "/admin/settings": "/administracao/configuracoes",
    "/admin/team": "/administracao/equipe",
    "/admin/users": "/administracao/usuarios",
    "/admin/venues": "/administracao/locais",
    "/admin/verifications": "/administracao/verificacoes",
    "/admin": "/administracao",
    "/consent": "/consentimento",
    "/directory": "/diretorio",
    "/events": "/eventos",
    "/forgot-password": "/esqueci-senha",
    "/invite": "/convite",
    "/login": "/entrar",
    "/member-card": "/cartao-membro",
    "/partners": "/parceiros",
    "/plate": "/placa",
    "/premium-id": "/identificacao-premium",
    "/premium-flow": "/fluxo-premium",
    "/privacy": "/privacidade",
    "/products": "/produtos",
    "/profile": "/perfil",
    "/reset-password": "/redefinir-senha",
    "/schedule-session": "/agendar-sessao",
    "/security": "/seguranca",
    "/signup": "/cadastro",
    "/subscriptions": "/assinaturas",
    "/verification-pending": "/verificacao-pendente",
  };

  for (const [from, to] of Object.entries(legacyRouteMap)) {
    if (pathname === from || pathname.startsWith(`${from}/`)) {
      const url = request.nextUrl.clone();
      url.pathname = `${to}${pathname.slice(from.length)}`;
      return NextResponse.redirect(url);
    }
  }

  // Paths that are public (don't need auth)
  const isPublicPath =
    pathname === "/entrar" ||
    pathname === "/cadastro" ||
    pathname === "/privacidade" ||
    pathname === "/terms-conditions" ||
    pathname === "/consentimento" ||
    pathname === "/seguranca" ||
    pathname === "/cookies" ||
    pathname === "/faq" ||
    pathname === "/" ||
    pathname === "/api/venues" ||
    pathname.startsWith("/api/premium/register") ||
    pathname.startsWith("/api/premium/checkout") ||
    pathname.startsWith("/api/premium/pay") ||
    pathname.startsWith("/api/premium/pending-order") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/api/auth");

  const isPendingPaymentPage = pathname === "/pendente-pagamento";

  const hasVisitedLanding = request.cookies.get("visited_landing")?.value === "true";

  if (!token) {
    // If visiting landing page, set the visited cookie
    if (pathname === "/") {
      const response = NextResponse.next();
      response.cookies.set("visited_landing", "true", {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    // Mandatory landing page visit for entrar/cadastro/protected routes
    if (!hasVisitedLanding && (pathname === "/entrar" || pathname === "/cadastro" || !isPublicPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Standard protected route check
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/entrar", request.url));
    }
  }

  if (token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET);

      const userCategory = payload.userCategory as string;

      // ── GATE: PENDENTE_PAGAMENTO ──────────────────────────────────────
      // Users who started premium flow but haven't paid yet can ONLY reach
      // the payment page. Any other protected route bounces them back there.
      if (!payload.isAdmin && userCategory === "PENDENTE_PAGAMENTO") {
        // Let them reach the payment page and the needed APIs
        if (isPendingPaymentPage || isPublicPath) {
          return NextResponse.next();
        }
        // Redirect entrar/cadastro/home to the payment page too
        return NextResponse.redirect(new URL("/pendente-pagamento", request.url));
      }

      // If already logged in and trying to access entrar/cadastro/home
      if (isPublicPath && (pathname === "/entrar" || pathname === "/cadastro" || pathname === "/")) {
        if (payload.isAdmin) {
          return NextResponse.redirect(new URL("/administracao", request.url));
        }
        return NextResponse.redirect(new URL("/eventos", request.url));
      }

      // If an admin tries to access user pages (anything not starting with /administracao, /api or auth), redirect to admin
      if (
        payload.isAdmin &&
        !pathname.startsWith("/administracao") &&
        !pathname.startsWith("/api") &&
        !isPublicPath
      ) {
        return NextResponse.redirect(new URL("/administracao", request.url));
      }

      // Check admin status for specific routes
      if (pathname.startsWith("/administracao") && !payload.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Check verification status (only for non-admin users)
      if (!payload.isAdmin) {
        const isVerified = payload.verificationStatus === "APROVADO";
        const isVerificationPage = pathname === "/em-analise";
        const isPremiumFlowPage = pathname === "/fluxo-premium";
        const hasPremiumAccessory = payload.hasPremiumAccessory as boolean;

        // Force PREMIUM users to buy accessory first
        if (userCategory === "PREMIUM" && !hasPremiumAccessory) {
          if (!isPremiumFlowPage && !isPublicPath) {
            return NextResponse.redirect(new URL("/fluxo-premium", request.url));
          }
        } else if (hasPremiumAccessory) {
          // Premium entitlement removes the need for subscriptions in any profile mode.
          if (pathname.startsWith("/assinaturas")) {
            return NextResponse.redirect(new URL("/eventos", request.url));
          }
          if (userCategory === "PREMIUM" && isPremiumFlowPage) {
            return NextResponse.redirect(new URL("/eventos", request.url));
          }
        }

        // If not verified and not already on the verification page, premium flow page, or public paths, redirect to verification
        if (!isVerified && !isVerificationPage && !isPremiumFlowPage && !isPublicPath) {
          return NextResponse.redirect(new URL("/em-analise", request.url));
        }

        // If verified and trying to access the verification page, redirect to home
        if (isVerified && isVerificationPage) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch (error) {
      // Token is invalid, remove it and redirect to entrar if it's not a public path
      if (!isPublicPath) {
        const response = NextResponse.redirect(new URL("/entrar", request.url));
        response.cookies.delete("auth_token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|images|videos|.*\\.(?:png|jpg|jpeg|svg|gif|webp)).*)",
  ],
};
