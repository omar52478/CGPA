// Utility functions for localStorage with performance optimizations

// Cache for localStorage values to reduce reads
const memoryCache: Record<string, any> = {}

/**
 * Get data from localStorage with caching
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  // Return from memory cache if available
  if (memoryCache[key] !== undefined) {
    return memoryCache[key]
  }
  
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return defaultValue
  }
  
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    
    // Parse and cache the value
    const value = JSON.parse(item) as T
    memoryCache[key] = value
    return value
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

/**
 * Set data to localStorage with caching
 */
export function setStorageItem<T>(key: string, value: T): void {
  // Update memory cache
  memoryCache[key] = value
  
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error)
  }
}

/**
 * Clear a specific item from localStorage and cache
 */
export function clearStorageItem(key: string): void {
  // Clear from memory cache
  delete memoryCache[key]
  
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return
  }
  
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}

/**
 * Clear all app-related items from localStorage and cache
 */
export function clearAllStorage(): void {
  // Clear memory cache
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key]
  })
  
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return
  }
  
  try {
    localStorage.removeItem("subjects")
    localStorage.removeItem("semesters")
    localStorage.removeItem("is3DBackgroundVisible")
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}
