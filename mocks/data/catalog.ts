import { SpecialSandwich, Ingredient, Extra } from '../../shared/api/adminTypes';

export let specialSandwiches: SpecialSandwich[] = [
  { id: "33333333-3333-3333-3333-333333333331", name: "Chicken Classic", description: "Grilled chicken with lettuce and mayo", isActive: true },
  { id: "33333333-3333-3333-3333-333333333332", name: "Turkey & Cheese", description: "Fresh turkey with swiss cheese", isActive: true },
  { id: "33333333-3333-3333-3333-333333333333", name: "Tuna Mayo", description: "Tuna mix with sweet corn", isActive: false },
  { id: "33333333-3333-3333-3333-333333333334", name: "Veggie Delight", description: "Fresh veggies with olive oil", isActive: true },
  { id: "33333333-3333-3333-3333-333333333335", name: "Beef BBQ", description: "Roast beef with BBQ sauce", isActive: true },
  { id: "33333333-3333-3333-3333-333333333336", name: "Ham & Swiss", description: "Classic ham and cheese", isActive: true },
  { id: "33333333-3333-3333-3333-333333333337", name: "Spicy Chicken", description: "Chicken with jalapeños", isActive: false },
  { id: "33333333-3333-3333-3333-333333333338", name: "Egg Salad", description: "Creamy egg salad", isActive: true }
];

export let ingredients: Ingredient[] = [
  { id: "44444444-4444-4444-4444-444444444441", name: "White Bread", category: "BREAD", isActive: true },
  { id: "44444444-4444-4444-4444-444444444442", name: "Whole Grain Bread", category: "BREAD", isActive: true },
  { id: "44444444-4444-4444-4444-444444444443", name: "Chicken", category: "MEAT", isActive: true },
  { id: "44444444-4444-4444-4444-444444444444", name: "Turkey", category: "MEAT", isActive: true },
  { id: "44444444-4444-4444-4444-444444444445", name: "Tuna", category: "MEAT", isActive: true },
  { id: "44444444-4444-4444-4444-444444444446", name: "Egg", category: "MEAT", isActive: true },
  { id: "44444444-4444-4444-4444-444444444447", name: "Beef", category: "MEAT", isActive: true },
  { id: "44444444-4444-4444-4444-444444444448", name: "Lettuce", category: "VEGGIES", isActive: true },
  { id: "44444444-4444-4444-4444-444444444449", name: "Tomato", category: "VEGGIES", isActive: true },
  { id: "44444444-4444-4444-4444-444444444450", name: "Cucumber", category: "VEGGIES", isActive: true },
  { id: "44444444-4444-4444-4444-444444444451", name: "Onion", category: "VEGGIES", isActive: true },
  { id: "44444444-4444-4444-4444-444444444452", name: "Pickles", category: "VEGGIES", isActive: true },
  { id: "44444444-4444-4444-4444-444444444453", name: "Mayo", category: "SAUCE", isActive: true },
  { id: "44444444-4444-4444-4444-444444444454", name: "Mustard", category: "SAUCE", isActive: true },
  { id: "44444444-4444-4444-4444-444444444455", name: "BBQ Sauce", category: "SAUCE", isActive: true }
];

export let extras: Extra[] = [
  { id: "55555555-5555-5555-5555-555555555551", name: "Apple", isActive: true },
  { id: "55555555-5555-5555-5555-555555555552", name: "Banana", isActive: true },
  { id: "55555555-5555-5555-5555-555555555553", name: "Cookie", isActive: true },
  { id: "55555555-5555-5555-5555-555555555554", name: "Yogurt", isActive: true },
  { id: "55555555-5555-5555-5555-555555555555", name: "Water", isActive: true },
  { id: "55555555-5555-5555-5555-555555555556", name: "Juice", isActive: true },
  { id: "55555555-5555-5555-5555-555555555557", name: "Chips", isActive: true },
  { id: "55555555-5555-5555-5555-555555555558", name: "Salad Cup", isActive: true },
  { id: "55555555-5555-5555-5555-555555555559", name: "Protein Bar", isActive: true },
  { id: "55555555-5555-5555-5555-555555555560", name: "Nuts Pack", isActive: true }
];
