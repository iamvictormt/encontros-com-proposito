export interface Event {
  id: string;
  title: string;
  image: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  tags: string[];
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  description: string;
  capacity: number;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  type: string;
  image: string;
  status: 'Ativo' | 'Pendente';
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand_id: string;
  stock: number;
  type?: 'Digital' | 'Físico';
  created_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  is_admin: boolean;
  role: string;
  avatar: string;
  created_at: string;
}

export interface Stat {
  label: string;
  value: string;
}
