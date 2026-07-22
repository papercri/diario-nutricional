export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          age: number
          weight: number
          height: number
          desired_weight: number
          sex: string
          activity_level: string
          goal: string
          allergens: string[]
          dietary_preferences: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          age?: number
          weight?: number
          height?: number
          desired_weight?: number
          sex?: string
          activity_level?: string
          goal?: string
          allergens?: string[]
          dietary_preferences?: string[]
        }
        Update: {
          name?: string
          age?: number
          weight?: number
          height?: number
          desired_weight?: number
          sex?: string
          activity_level?: string
          goal?: string
          allergens?: string[]
          dietary_preferences?: string[]
        }
      }
      meal_entries: {
        Row: {
          id: string
          user_id: string
          food_name: string
          food_brand: string | null
          food_calories: number
          food_protein: number
          food_carbs: number
          food_fat: number
          food_serving_size: string | null
          food_barcode: string | null
          food_image_url: string | null
          food_nutri_score: string | null
          servings: number
          meal_type: string
          date: string
          created_at: string
        }
        Insert: {
          user_id: string
          food_name: string
          food_brand?: string | null
          food_calories: number
          food_protein: number
          food_carbs: number
          food_fat: number
          food_serving_size?: string | null
          food_barcode?: string | null
          food_image_url?: string | null
          food_nutri_score?: string | null
          servings?: number
          meal_type: string
          date: string
        }
        Update: {
          food_name?: string
          food_brand?: string | null
          food_calories?: number
          food_protein?: number
          food_carbs?: number
          food_fat?: number
          food_serving_size?: string | null
          food_barcode?: string | null
          food_image_url?: string | null
          food_nutri_score?: string | null
          servings?: number
          meal_type?: string
        }
      }
      saved_plates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string | null
          image_url: string | null
          ingredients: Array<{ name: string; quantity: string; calories?: number }>
          allergens: string[]
          is_vegan: boolean
          is_vegetarian: boolean
          nutrition_score: { value: number; reason?: string } | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size?: string | null
          image_url?: string | null
          ingredients?: Array<{ name: string; quantity: string; calories?: number }>
          allergens?: string[]
          is_vegan?: boolean
          is_vegetarian?: boolean
          nutrition_score?: { value: number; reason?: string } | null
        }
        Update: {
          name?: string
          description?: string | null
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          serving_size?: string | null
          image_url?: string | null
          ingredients?: Array<{ name: string; quantity: string; calories?: number }>
          allergens?: string[]
          is_vegan?: boolean
          is_vegetarian?: boolean
          nutrition_score?: { value: number; reason?: string } | null
        }
      }
      saved_recipes: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          instructions: string
          ingredients: Array<{ name: string; quantity: string }>
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          serving_size: string | null
          image_url: string | null
          allergens: string[]
          is_vegan: boolean
          is_vegetarian: boolean
          nutrition_score: { value: number; reason?: string } | null
          prep_time: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          instructions: string
          ingredients?: Array<{ name: string; quantity: string }>
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          serving_size?: string | null
          image_url?: string | null
          allergens?: string[]
          is_vegan?: boolean
          is_vegetarian?: boolean
          nutrition_score?: { value: number; reason?: string } | null
          prep_time?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          instructions?: string
          ingredients?: Array<{ name: string; quantity: string }>
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          serving_size?: string | null
          image_url?: string | null
          allergens?: string[]
          is_vegan?: boolean
          is_vegetarian?: boolean
          nutrition_score?: { value: number; reason?: string } | null
          prep_time?: string | null
        }
      }
    }
  }
}
