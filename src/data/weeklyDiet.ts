// Tabella settimanale alimentare specifica
export const WEEKLY_DIET_PLAN: Record<
  number,
  {
    day: string;
    meals: Array<{
      time: string;
      name: string;
      items: Array<{
        food: string;
        details?: string;
        completed?: boolean;
      }>;
    }>;
  }
> = {
  0: {
    // Domenica
    day: 'Domenica',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          {
            food: 'Omelette',
            details: '3+3 con cipolla + zucchine o peperoni + aglio + EVOO',
          },
          { food: 'Avocado', details: '½ avocado' },
          {
            food: 'Porridge quinoa',
            details:
              'quinoa + mirtilli + semi di chia + inulina + cacao 6g + cannella',
          },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          {
            food: 'Tacchino',
            details: '200g al curry (curcuma/pepe + zenzero)',
          },
          { food: 'Riso integrale', details: '100g (aceto mele prima)' },
          { food: 'Cavolini o broccoli', details: '+ EVOO' },
          { food: 'Semi di zucca + fermentati' },
          { food: 'Legumi', details: '150g' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          {
            food: 'Shake vegetale',
            details: '+ spinaci + fragole + burro mandorle + cacao 6g',
          },
          { food: 'Cioccolato fondente', details: '2 quadretti 90%' },
        ],
      },
    ],
  },
  1: {
    // Lunedì
    day: 'Lunedì',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          {
            food: 'Omelette',
            details: '3 uova + 3 albumi con spinaci + aglio + 1 cucchiaio EVOO',
          },
          { food: 'Avocado', details: '¼ avocado' },
          {
            food: 'Porridge quinoa',
            details:
              '+ latte di mandorla + mirtilli + semi di chia + GOS + inulina + cacao 6g + cannella',
          },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          { food: 'Salmone', details: '200g con curcuma + pepe + zenzero' },
          { food: 'Quinoa', details: '¾ tazza + patata dolce' },
          { food: 'Broccoli', details: '+ semi di zucca + EVOO' },
          { food: 'Insalata verde', details: '+ crauti/kimchi' },
          { food: 'Ceci/lenticchie', details: '150g' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          {
            food: 'Shake proteico',
            details: '+ banana + spinaci + burro di mandorle + cacao 6g',
          },
          { food: 'Cioccolato fondente', details: '2 quadretti 90%' },
        ],
      },
    ],
  },
  2: {
    // Martedì
    day: 'Martedì',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          { food: 'Pancake avena GF', details: '+ albume + 1 uovo + cannella' },
          { food: "Burro d'arachidi" },
          { food: 'Fragole & lamponi' },
          { food: 'Tè verde' },
          { food: 'EVOO', details: '1 cucchiaio a crudo' },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          { food: 'Petto di pollo', details: '200g al rosmarino + cumino' },
          { food: 'Riso integrale', details: '100g (aceto mele prima)' },
          { food: 'Cavolo nero', details: '+ aglio + EVOO' },
          { food: 'Avocado', details: '¼ avocado' },
          { food: 'Legumi', details: '150g + fermentati' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          { food: 'Yogurt vegetale', details: '+ proteine + noci + inulina' },
          { food: 'Mela verde', details: '1 mela' },
        ],
      },
    ],
  },
  3: {
    // Mercoledì
    day: 'Mercoledì',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          {
            food: 'Uova strapazzate',
            details: '(3+2) con zucchine + curcuma/pepe + EVOO',
          },
          {
            food: 'Quinoa',
            details: '½ tazza + semi di lino + mirtilli + GOS',
          },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          { food: 'Tacchino', details: '200g con curcuma + limone + zenzero' },
          { food: 'Patata dolce', details: '200g (aceto mele prima)' },
          { food: 'Spinaci', details: '+ sesamo + EVOO' },
          { food: 'Legumi', details: '150g + fermentati' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          {
            food: 'Shake vegetale',
            details: '+ latte mandorla + fragole + burro anacardi + cacao 6g',
          },
          { food: 'Cioccolato fondente', details: '2 quadretti 90%' },
        ],
      },
    ],
  },
  4: {
    // Giovedì
    day: 'Giovedì',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          {
            food: 'Omelette',
            details: '3+3 con zucchine o peperoni + aglio + prezzemolo + EVOO',
          },
          { food: 'Avocado', details: '½ avocado' },
          {
            food: 'Porridge amaranto',
            details: '+ lamponi + semi di chia + inulina + cacao 6g + cannella',
          },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          { food: 'Tonno', details: '200g' },
          {
            food: 'Bowl crucifere',
            details:
              '(broccoli+cauli ≥250g) + lenticchie nere 150g + cumino + zenzero + EVOO',
          },
          { food: 'Fermentati', details: '2–4 cucchiai' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          {
            food: 'Yogurt vegetale',
            details: '+ proteine + mirtilli + 1–2 noci brasiliane',
          },
          { food: 'Kiwi', details: '1 kiwi' },
        ],
      },
    ],
  },
  5: {
    // Venerdì
    day: 'Venerdì',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          {
            food: 'Uova strapazzate',
            details: '(3+2) con spinaci + curcuma/pepe + EVOO',
          },
          {
            food: 'Quinoa',
            details: '½ tazza + semi di lino + mirtilli + GOS/inulina',
          },
          { food: 'Tè verde' },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          { food: 'Manzo magro', details: '200g (solo 1 volta/sett)' },
          { food: 'Patata dolce', details: '200g (aceto mele prima)' },
          {
            food: 'Insalata',
            details: 'cavolo cappuccio + carote + semi di girasole + EVOO',
          },
          { food: 'Legumi', details: '150g + fermentati' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          {
            food: 'Shake proteico',
            details: '+ latte riso + banana + burro arachidi + cacao 6g',
          },
        ],
      },
    ],
  },
  6: {
    // Sabato
    day: 'Sabato',
    meals: [
      {
        time: '07:00',
        name: 'Idratazione & Primer',
        items: [
          { food: 'Acqua tiepida + limone + sale Stabilium' },
          { food: 'Spremuta di melograno (opzionale)' },
        ],
      },
      {
        time: '08:00',
        name: 'Colazione',
        items: [
          { food: 'Pancake proteici', details: 'avena GF + albume + proteine' },
          { food: 'Frutti di bosco', details: '≥150g' },
          { food: 'Burro di mandorle' },
          { food: 'Tè verde + EVOO' },
        ],
      },
      {
        time: '12:30',
        name: 'Pranzo',
        items: [
          { food: 'Sgombro/sardine', details: '200g' },
          { food: 'Quinoa', details: '¾ tazza (aceto mele prima)' },
          { food: 'Broccoli + spinaci', details: '+ semi di lino + EVOO' },
          { food: 'Insalata', details: 'rucola+pomodorini + fermentati' },
          { food: 'Legumi', details: '150g' },
        ],
      },
      {
        time: '15:30',
        name: 'Snack/Post-WO',
        items: [
          {
            food: 'Yogurt vegetale',
            details: '+ proteine + semi di chia + noci',
          },
          { food: 'Mela', details: '1 mela' },
        ],
      },
    ],
  },
};
