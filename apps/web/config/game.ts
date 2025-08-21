// apps/web/config/games.ts
export interface Game {
    id: string;
    name: string;
    description: string;
    image: string;
    route: string;
    category: string;
    players: string;
    complexity: 'Low' | 'Medium' | 'High';
  }
  
  export const games: Game[] = [
    {
      id: 'blackjack',
      name: 'Blackjack',
      description: 'The classic drinking card game with a twist. Get as close to 21 as possible without going over.',
      image: '/blackjack.png',
      route: '/games/blackjack',
      category: 'Card Game',
      players: '2-8',
      complexity: 'Medium'
    },
    {
      id: 'quiplash',
      name: 'Quiplash',
      description: 'Hilarious battle of wits where you provide funny answers to prompts and vote on the best ones.',
      image: '/quiplash.png',
      route: '/games/quiplash',
      category: 'Party Game',
      players: '3-8',
      complexity: 'Low'
    },
    {
      id: 'most-likely',
      name: 'Most Likely To',
      description: 'Reveal what your friends really think about each other with this revealing party game.',
      image: '/most-likely-to.png',
      route: '/games/most-likely',
      category: 'Party Game',
      players: '4-10',
      complexity: 'Low'
    },
    {
      id: 'charades',
      name: 'Charades',
      description: 'The classic acting game with a drinking twist. Act out prompts without speaking.',
      image: '/charades.png',
      route: '/games/charades',
      category: 'Party Game',
      players: '4-12',
      complexity: 'Low'
    },
    {
      id: 'powerhour',
      name: 'Power Hour',
      description: 'Take a shot of beer every minute for an hour. Customize with your own music playlists.',
      image: '/powerhour.png',
      route: '/games/powerhour',
      category: 'Drinking Game',
      players: '1+',
      complexity: 'Low'
    },
    {
      id: 'ride-the-bus',
      name: 'Ride the Bus',
      description: 'A challenging drinking game where wrong answers lead to more drinks. How long can you last?',
      image: '/ride-the-bus.png',
      route: '/games/ride-the-bus',
      category: 'Card Game',
      players: '3-8',
      complexity: 'Medium'
    },
    {
      id: 'around-the-world',
      name: 'Around the World',
      description: 'A classic card game that takes players on a drinking journey around the table.',
      image: '/around-the-world.png',
      route: '/games/around-the-world',
      category: 'Card Game',
      players: '4-8',
      complexity: 'Low'
    },
    {
      id: 'beer-olympics',
      name: 'Beer Olympics',
      description: 'Organize and compete in a tournament of various drinking games with team competitions.',
      image: '/tournament.png',
      route: '/games/beer-olympics',
      category: 'Tournament',
      players: '6+',
      complexity: 'High'
    }
  ];
  
  export const gameCategories = [
    'All Games',
    'Card Game',
    'Party Game',
    'Drinking Game',
    'Tournament'
  ];