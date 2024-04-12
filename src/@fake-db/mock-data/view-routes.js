export const rows = [
  {
    route_name: 'Test Route',
    route_start: 'Malabe, Sri Lanka',
    route_end: 'Anuradhapura, Sri Lanka',
    route_distance: '200.03',
    route_duration: '4.23',
    route_stops: [
      {
        description: 'Malabe, Sri Lanka',
        matched_substrings: [
          {
            length: 6,
            offset: 0
          }
        ],
        place_id: 'ChIJgd8BltVW4joRukmNbtkdGgM',
        reference: 'ChIJgd8BltVW4joRukmNbtkdGgM',
        structured_formatting: {
          main_text: 'Malabe',
          main_text_matched_substrings: [
            {
              length: 6,
              offset: 0
            }
          ],
          secondary_text: 'Sri Lanka'
        },
        terms: [
          {
            offset: 0,
            value: 'Malabe'
          },
          {
            offset: 8,
            value: 'Sri Lanka'
          }
        ],
        types: ['locality', 'political', 'geocode'],
        position: {
          lat: 6.9060787,
          lng: 79.96962769999999
        }
      },
      {
        description: 'Anuradhapura, Sri Lanka',
        matched_substrings: [
          {
            length: 3,
            offset: 0
          }
        ],
        place_id: 'ChIJWeFgk_n0_DoRDs9tvJ7-EcE',
        reference: 'ChIJWeFgk_n0_DoRDs9tvJ7-EcE',
        structured_formatting: {
          main_text: 'Anuradhapura',
          main_text_matched_substrings: [
            {
              length: 3,
              offset: 0
            }
          ],
          secondary_text: 'Sri Lanka'
        },
        terms: [
          {
            offset: 0,
            value: 'Anuradhapura'
          },
          {
            offset: 14,
            value: 'Sri Lanka'
          }
        ],
        types: ['locality', 'political', 'geocode'],
        position: {
          lat: 8.311351799999999,
          lng: 80.4036508
        }
      }
    ]
  }
]
