import type { Category } from '../types';
import { fallbackCategories } from '../constants/reportCategories';
import { apiRequest } from './api/httpClient';
import { API_ROUTES } from './api/endpoints';

export const CategoriesService = {
  async listCategories() {
    const response = await apiRequest<unknown>(API_ROUTES.categories);
    const categories = normalizeCategoriesResponse(response);
    return categories.length ? categories : fallbackCategories;
  },

  fallbackCategories() {
    return fallbackCategories;
  }
};

function normalizeCategoriesResponse(response: unknown): Category[] {
  const rawItems = extractCategoryItems(response);
  return rawItems.map(normalizeCategory).filter(Boolean) as Category[];
}

function extractCategoryItems(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== 'object') return [];

  const root = response as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(root.categorias)) return root.categorias;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.rows)) return root.rows;
  if (Array.isArray(root.content)) return root.content;
  if (Array.isArray(root.payload)) return root.payload;
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    const nested = data as Record<string, unknown>;
    if (Array.isArray(nested.items)) return nested.items;
    if (Array.isArray(nested.categorias)) return nested.categorias;
    if (Array.isArray(nested.data)) return nested.data;
    if (Array.isArray(nested.results)) return nested.results;
    if (Array.isArray(nested.rows)) return nested.rows;
    if (Array.isArray(nested.content)) return nested.content;
    if (Array.isArray(nested.payload)) return nested.payload;

    const nestedData = nested.data;
    if (nestedData && typeof nestedData === 'object') {
      const deep = nestedData as Record<string, unknown>;
      if (Array.isArray(deep.items)) return deep.items;
      if (Array.isArray(deep.categorias)) return deep.categorias;
      if (Array.isArray(deep.results)) return deep.results;
      if (Array.isArray(deep.rows)) return deep.rows;
      if (Array.isArray(deep.content)) return deep.content;
    }
  }

  return [];
}

function normalizeCategory(raw: unknown): Category | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;

  const id = item.id ?? item.categoria_id ?? item.category_id ?? item.id_categoria ?? item.categoriaId ?? item.value;
  const nome =
    item.nome ??
    item.name ??
    item.categoria_nome ??
    item.nome_categoria ??
    item.categoriaNome ??
    item.label ??
    item.titulo ??
    item.tipo;
  const descricao = item.descricao ?? item.description;

  if (id === undefined || id === null || !nome) return null;

  return {
    id: id as string | number,
    nome: String(nome),
    descricao: descricao ? String(descricao) : undefined
  };
}
