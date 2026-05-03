CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS recipe_app_1777822364475_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  cuisine_type VARCHAR(100) NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_app_1777822364475_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipe_app_1777822364475_recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_app_1777822364475_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipe_app_1777822364475_recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_app_1777822364475_dietary_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipe_app_1777822364475_recipes(id) ON DELETE CASCADE,
  restriction VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_app_1777822364475_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  recipe_id UUID NOT NULL REFERENCES recipe_app_1777822364475_recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipe_app_1777822364475_recipes(name);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_type ON recipe_app_1777822364475_recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON recipe_app_1777822364475_recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON recipe_app_1777822364475_ingredients(name);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON recipe_app_1777822364475_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON recipe_app_1777822364475_favorites(recipe_id);