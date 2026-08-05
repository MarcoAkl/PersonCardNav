import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFavorites } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when localStorage has nothing saved', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites.size).toBe(0);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('adds an id on toggle and marks it favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite(42));

    expect(result.current.isFavorite(42)).toBe(true);
    expect(result.current.favorites.has(42)).toBe(true);
  });

  it('removes an id on a second toggle', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite(7));
    expect(result.current.isFavorite(7)).toBe(true);

    act(() => result.current.toggleFavorite(7));
    expect(result.current.isFavorite(7)).toBe(false);
  });

  it('persists to localStorage so a fresh hook instance picks it up', () => {
    const first = renderHook(() => useFavorites());
    act(() => first.result.current.toggleFavorite(99));

    const second = renderHook(() => useFavorites());
    expect(second.result.current.isFavorite(99)).toBe(true);
    expect(JSON.parse(localStorage.getItem('personCardNav.favorites') ?? '[]')).toEqual([99]);
  });

  it('keeps multiple ids independent', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite(1));
    act(() => result.current.toggleFavorite(2));
    act(() => result.current.toggleFavorite(1));

    expect(result.current.isFavorite(1)).toBe(false);
    expect(result.current.isFavorite(2)).toBe(true);
  });
});
