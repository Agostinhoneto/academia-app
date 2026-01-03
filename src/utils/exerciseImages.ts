// Mapeamento de imagens padrão para exercícios
// URLs de imagens públicas de exercícios

export const exerciseImages: Record<string, string> = {
  // Peito
  'supino': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
  'supino reto': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
  'supino inclinado': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'supino declinado': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  'crucifixo': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
  'crucifixo com halteres': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
  'crucifixo inclinado': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  'flexão': 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b639?w=400',
  'crossover': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',

  // Costas
  'barra fixa': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',
  'pull up': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',
  'puxada': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',
  'remada': 'https://images.unsplash.com/photo-1579758682665-53a1a614eea6?w=400',
  'remada curvada': 'https://images.unsplash.com/photo-1579758682665-53a1a614eea6?w=400',
  'remada baixa': 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=400',
  'levantamento terra': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
  'deadlift': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',

  // Pernas
  'agachamento': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400',
  'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400',
  'leg press': 'https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?w=400',
  'cadeira extensora': 'https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?w=400',
  'cadeira flexora': 'https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?w=400',
  'stiff': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  'panturrilha': 'https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?w=400',
  'afundo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',

  // Ombros
  'desenvolvimento': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',
  'desenvolvimento militar': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',
  'elevação lateral': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'elevação frontal': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'crucifixo inverso': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  'remada alta': 'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=400',

  // Bíceps
  'rosca': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
  'rosca direta': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
  'rosca alternada': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
  'rosca martelo': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
  'rosca scott': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
  'rosca concentrada': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',

  // Tríceps
  'tríceps': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400',
  'tríceps testa': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400',
  'tríceps corda': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400',
  'tríceps francês': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400',
  'mergulho': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',
  'paralelas': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400',

  // Abdômen
  'abdominal': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'prancha': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'elevação de pernas': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
};

// Função para buscar imagem do exercício
export function getExerciseImage(exerciseName: string, apiImage?: string): string | undefined {
  // Se a API retornou uma imagem, usa ela
  if (apiImage) {
    return apiImage;
  }

  // Normaliza o nome do exercício (lowercase, remove acentos)
  const normalizedName = exerciseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Procura por correspondência exata
  if (exerciseImages[normalizedName]) {
    return exerciseImages[normalizedName];
  }

  // Procura por correspondência parcial
  const matchingKey = Object.keys(exerciseImages).find(key => 
    normalizedName.includes(key) || key.includes(normalizedName)
  );

  return matchingKey ? exerciseImages[matchingKey] : undefined;
}
