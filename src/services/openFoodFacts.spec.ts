import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchFood, getProductByBarcode, OpenFoodFactsError } from './openFoodFacts'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function makeSearchProduct(overrides: Record<string, unknown> = {}) {
  return {
    code: '123456',
    product_name: 'Test Product',
    brands: 'Test Brand',
    nutriments: {
      'energy-kcal_100g': 250,
      proteins_100g: 12,
      carbohydrates_100g: 30,
      fat_100g: 8,
    },
    image_url: 'https://example.com/image.jpg',
    serving_size: '100g',
    nutriscore_grade: 'b',
    ...overrides,
  }
}

const emptySearchResult = {
  count: 0,
  page: 1,
  page_size: 20,
  products: [] as Array<Record<string, unknown>>,
}

function mockJsonResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(data),
  }
}

describe('openFoodFacts service', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('searchFood', () => {
    it('returns empty array for empty query', async () => {
      const results = await searchFood('')
      expect(results).toHaveLength(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('returns empty array for whitespace-only query', async () => {
      const results = await searchFood('   ')
      expect(results).toHaveLength(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('returns food items from search results', async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({
          ...emptySearchResult,
          products: [makeSearchProduct()],
        }),
      )

      const results = await searchFood('test')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Test Product')
      expect(results[0].brand).toBe('Test Brand')
      expect(results[0].calories).toBe(250)
      expect(results[0].protein).toBe(12)
      expect(results[0].carbs).toBe(30)
      expect(results[0].fat).toBe(8)
      expect(results[0].nutriScore).toBe('b')
    })

    it('filters out products without name', async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({
          ...emptySearchResult,
          products: [makeSearchProduct({ product_name: undefined })],
        }),
      )

      const results = await searchFood('test')
      expect(results).toHaveLength(0)
    })

    it('filters out products with 0 calories', async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({
          ...emptySearchResult,
          products: [
            makeSearchProduct({
              nutriments: { 'energy-kcal_100g': 0 },
            }),
          ],
        }),
      )

      const results = await searchFood('test')
      expect(results).toHaveLength(0)
    })

    it('handles invalid nutriscore grade', async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({
          ...emptySearchResult,
          products: [makeSearchProduct({ nutriscore_grade: 'invalid' })],
        }),
      )

      const results = await searchFood('test')
      expect(results).toHaveLength(1)
      expect(results[0].nutriScore).toBeUndefined()
    })

    it('throws OpenFoodFactsError on HTTP error', async () => {
      mockFetch.mockResolvedValue(mockJsonResponse({}, false, 500))

      await expect(searchFood('test')).rejects.toThrow(OpenFoodFactsError)
    })

    it('throws OpenFoodFactsError on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(searchFood('test')).rejects.toThrow(OpenFoodFactsError)
    })
  })

  describe('getProductByBarcode', () => {
    it('returns food item for valid barcode', async () => {
      mockFetch.mockResolvedValue(
        mockJsonResponse({
          code: '123456',
          status: 1,
          product: {
            product_name: 'Test Product',
            brands: 'Test Brand',
            nutriments: {
              'energy-kcal_100g': 250,
              proteins_100g: 12,
              carbohydrates_100g: 30,
              fat_100g: 8,
            },
            image_url: 'https://example.com/image.jpg',
            serving_size: '100g',
            nutriscore_grade: 'b',
          },
        }),
      )

      const result = await getProductByBarcode('123456')
      expect(result).not.toBeNull()
      expect(result?.name).toBe('Test Product')
      expect(result?.barcode).toBe('123456')
    })

    it('returns null when product not found', async () => {
      mockFetch.mockResolvedValue(mockJsonResponse({ status: 0, product: null }))

      const result = await getProductByBarcode('999999')
      expect(result).toBeNull()
    })

    it('throws OpenFoodFactsError on HTTP error', async () => {
      mockFetch.mockResolvedValue(mockJsonResponse({}, false, 404))

      await expect(getProductByBarcode('123456')).rejects.toThrow(OpenFoodFactsError)
    })
  })
})
