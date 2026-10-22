// Theme landing pages. Products are matched by name, so a design can appear in more than one theme.

export const CATEGORIES = [
  {
    slug: 'personalised-name-doona-covers',
    name: 'Personalised Name Doona Covers',
    title: 'Personalised Name Doona Covers & Quilt Cover Sets',
    description: 'Personalised doona cover sets with your child\u2019s name printed on the design. Cot to Super King, Premium Polyester or 100% Cotton, made to order in Australia sizes.',
    intro: [
      'Add a name to any of our designs and it\u2019s printed right onto the doona cover, so it\u2019s theirs and nobody else\u2019s. Pick a font, colour and position in the designer and see a print preview before you order.',
      'Every set comes in standard Australian bed sizes, from Cot to Super King, with matching pillowcases. Choose soft Premium Polyester for bright colours or breathable 100% Cotton.'
    ],
    match: /personali[sz]ed|custom name|your name/i,
    faqs: [
      ['Can I add any name?', 'Yes. Type the name in the designer, choose a font, colour, size and position, and check the print preview before adding it to your cart.'],
      ['Is the name embroidered?', 'No, the name is printed as part of the design, so it washes and wears the same as the rest of the doona cover.']
    ]
  },
  {
    slug: 'custom-photo-doona-covers',
    name: 'Custom Photo Doona Covers',
    title: 'Custom Photo Doona Covers \u2013 Print Your Own Photo',
    description: 'Turn a family photo, pet or holiday snap into a custom photo doona cover set. Upload in the designer, preview the print and order in any Australian bed size.',
    intro: [
      'Upload your favourite photo in the designer and we\u2019ll print it across a full doona cover set. Drag to reposition, zoom, add a name and check the print preview at the real proportions of your bed size.',
      'For the sharpest print, use a recent phone photo or camera image (at least 2000 pixels wide). The designer warns you if a photo is too small to print well.'
    ],
    match: /photo|picture/i,
    designerLed: true,
    faqs: [
      ['What photos work best?', 'Bright, in-focus photos at least 2000 pixels wide. Most modern phone photos are perfect. The designer shows a quality check after you upload.'],
      ['Can I add text to my photo doona cover?', 'Yes. Add a name or short message, choose the font and colour, and place it at the top, middle or lower part of the cover.']
    ]
  },
  {
    slug: 'kids-artwork-doona-covers',
    name: 'Kids\u2019 Artwork Doona Covers',
    title: 'Turn Your Child\u2019s Drawing into a Doona Cover',
    description: 'Print your child\u2019s drawing or painting on a custom doona cover set. Snap a photo, upload it to the designer and order in Cot to Super King.',
    intro: [
      'Kids\u2019 drawings make the most loved bedding. Take a clear, well-lit photo of the artwork, upload it in the designer and we\u2019ll print it across the doona cover.',
      'Add their name, pick a backing colour and choose Premium Polyester or 100% Cotton. Every set is made to order in standard Australian bed sizes.'
    ],
    match: /artwork|drawing/i,
    designerLed: true,
    faqs: [
      ['How do I photograph my child\u2019s artwork?', 'Lay it flat in daylight, avoid shadows and glare, and take the photo straight on. Crop out the background before uploading for the best result.'],
      ['Can you print paintings and crayon drawings?', 'Yes. Any artwork you can photograph clearly can be printed, including crayon, pencil, marker and paint.']
    ]
  },
  {
    slug: 'sports-doona-covers',
    name: 'Sports Doona Covers',
    title: 'Sports Doona Covers & Quilt Cover Sets for Kids',
    description: 'Football, soccer, basketball, baseball and more. Shop sports doona covers and quilt cover sets for kids and teens, personalised with a name, in Australian sizes.',
    intro: [
      'For the kid who lives in their footy boots, our sports doona covers bring the game to the bedroom: soccer, football, basketball, baseball, rugby and more.',
      'Add their name or team colours in the designer, then choose any size from Cot to Super King in Premium Polyester or 100% Cotton.'
    ],
    match: /sport|football|soccer|basketball|baseball|rugby|afl|cricket|tennis|hockey|athlete|gridiron|slam dunk|touchdown|home run|grand slam|goal/i,
    faqs: [
      ['Can I add my child\u2019s name to a sports design?', 'Yes. Open any design in the designer, type their name and choose a font and colour that suits their team.'],
      ['Do you have King Single sports doona covers?', 'Yes, every design comes in Cot, Single, King Single, Double, Queen, King and Super King.']
    ]
  },
  {
    slug: 'animal-doona-covers',
    name: 'Animal Doona Covers',
    title: 'Animal Doona Covers & Quilt Cover Sets',
    description: 'Lions, penguins, frogs, farmyard friends and more. Shop animal doona covers and quilt cover sets for kids, made to order in Australian bed sizes.',
    intro: [
      'From safari lions to farmyard friends, penguins, frogs and llamas, our animal designs turn bedtime into an adventure.',
      'Personalise any design with a name, then pick your bed size and fabric. Every set is printed to order with matching pillowcases.'
    ],
    match: /animal|lion|tiger|kitty|kitten|puppy|pups|bear|sloth|axolotl|octopus|safari|jungle|eagle|wolf|fox|panda|horse|owl|elephant|giraffe|koala|kangaroo|penguin|frog|froggy|llama|cow|farmyard|farm|bunny|shiba|canine|feline|whiskers|cats\b|cat\b|dog/i,
    faqs: [
      ['Are animal designs suitable for toddlers?', 'Yes. Every design is available in Cot size (100 \u00d7 120 cm) as well as all standard bed sizes.'],
      ['Can I add a name to an animal design?', 'Yes, any design can be personalised with a name in the designer.']
    ]
  },
  {
    slug: 'pet-quilt-covers',
    name: 'Dog & Cat Quilt Covers',
    title: 'Dog & Cat Quilt Covers and Pet Doona Covers',
    description: 'Dog and cat quilt cover sets for pet lovers, or upload a photo of your own pet. Made to order in Australian bed sizes, Premium Polyester or 100% Cotton.',
    intro: [
      'Puppies, kittens and cheeky cats: our pet designs are made for animal lovers of every age.',
      'Want your own pet on the bed? Upload a photo in the designer and we\u2019ll print it across a custom doona cover set.'
    ],
    match: /dog|puppy|pups|kitty|kitten|cats\b|cat\b|feline|canine|shiba|whiskers/i,
    faqs: [
      ['Can I put a photo of my own pet on a doona cover?', 'Yes. Upload the photo in the designer, position it and preview the print before you order.']
    ]
  },
  {
    slug: 'dreamcatcher-quilt-covers',
    name: 'Dreamcatcher & Boho Quilt Covers',
    title: 'Dreamcatcher & Boho Quilt Cover Sets',
    description: 'Dreamcatcher, feather and boho quilt cover sets in rich colours. Made to order in standard Australian bed sizes, with a name or message if you like.',
    intro: [
      'Feathers, dreamcatchers and night-sky designs for a calm, boho bedroom.',
      'Every quilt cover set is printed to order in Premium Polyester or 100% Cotton, in any size from Cot to Super King.'
    ],
    match: /dream ?catcher|boho|bohemian|mandala|feather|dreamweaver/i,
    faqs: [
      ['Do dreamcatcher designs come in Queen and King?', 'Yes, every design is available in all standard Australian sizes up to Super King.']
    ]
  },
  {
    slug: 'space-doona-covers',
    name: 'Space & Galaxy Doona Covers',
    title: 'Space & Galaxy Doona Covers for Kids',
    description: 'Rockets, planets, astronauts and galaxies. Space doona covers and quilt cover sets for kids, personalised with a name, in Australian bed sizes.',
    intro: [
      'Blast off to bedtime with rockets, planets, astronauts and glowing galaxies.',
      'Add your little astronaut\u2019s name in the designer, then choose bed size and fabric.'
    ],
    match: /space|galax|galactic|rocket|planet|astronaut|cosmic|celestial|moon|robo/i,
    faqs: [
      ['Can I personalise a space doona cover?', 'Yes, add a name or short message in the designer and preview it before ordering.']
    ]
  },
  {
    slug: 'floral-quilt-covers',
    name: 'Floral Quilt Covers',
    title: 'Floral Quilt Cover Sets',
    description: 'Sunflowers, roses, tropical leaves and botanical prints. Floral quilt cover sets made to order in standard Australian bed sizes.',
    intro: [
      'Bright sunflowers, soft roses and tropical leaves to freshen up any bedroom.',
      'Pick your size from Cot to Super King and choose Premium Polyester or 100% Cotton.'
    ],
    match: /flower|floral|sunflower|rose\b|roses|botanical|blossom|garden|leaf|leaves|tropical|cactus|mushroom/i,
    faqs: [
      ['Are floral designs available in King size?', 'Yes, all designs come in King (240 \u00d7 220 cm) and Super King (260 \u00d7 230 cm).']
    ]
  },
  {
    slug: 'ocean-beach-quilt-covers',
    name: 'Ocean & Beach Quilt Covers',
    title: 'Ocean & Beach Quilt Cover Sets',
    description: 'Sharks, whales, mermaids and beach scenes. Ocean quilt cover sets for kids and coastal bedrooms, made to order in Australian sizes.',
    intro: [
      'Sharks, whales, turtles, mermaids and sunny beach scenes, perfect for coastal bedrooms and ocean-loving kids.',
      'Add a name, choose the size and fabric, and your set is printed to order.'
    ],
    match: /ocean|sea\b|shark|whale|dolphin|mermaid|beach|surf|coral|turtle|octopus/i,
    faqs: [
      ['Can I add a name to an ocean design?', 'Yes, every design can be personalised in the designer.']
    ]
  },
  {
    slug: 'christmas-quilt-covers',
    name: 'Christmas Quilt Covers',
    title: 'Christmas Quilt Covers & Festive Doona Covers',
    description: 'Festive Christmas quilt cover sets and personalised doona covers. Made to order, so order early: allow 3\u20134 weeks for delivery in Australia.',
    intro: [
      'Bring the festive season into the bedroom with Christmas quilt cover sets, or personalise one as a gift with a name.',
      'Every set is made to order. Please allow 3\u20134 weeks for production and delivery, so order early for Christmas.'
    ],
    match: /christmas|xmas|festive|santa|reindeer|snowman/i,
    faqs: [
      ['When should I order for Christmas?', 'Each set is made to order, so allow 3\u20134 weeks for production and delivery within Australia. Ordering by late November is safest.']
    ]
  },
  {
    slug: 'unicorn-doona-covers',
    name: 'Unicorn Doona Covers',
    title: 'Unicorn Doona Covers & Quilt Cover Sets',
    description: 'Magical unicorn doona covers and quilt cover sets for kids, personalised with a name, in Cot to Super King.',
    intro: [
      'Rainbows, sparkles and unicorns for a magical bedroom.',
      'Add a name in the designer and choose Premium Polyester for extra-vivid colours or 100% Cotton.'
    ],
    match: /unicorn|rainbow|kawaii/i,
    faqs: [
      ['Is there a unicorn doona cover in Single size?', 'Yes, every design comes in Single (140 \u00d7 210 cm) and all other standard sizes.']
    ]
  },
  {
    slug: 'dinosaur-doona-covers',
    name: 'Dinosaur Doona Covers',
    title: 'Dinosaur Doona Covers & Quilt Cover Sets',
    description: 'Dinosaur and dragon doona covers for kids, personalised with a name. Made to order in standard Australian bed sizes.',
    intro: [
      'T-rexes, roaring dinos and dragons for little explorers.',
      'Personalise with a name, then choose your size and fabric.'
    ],
    match: /dino|t-?rex|jurassic|dragon/i,
    faqs: [
      ['Can I personalise a dinosaur doona cover?', 'Yes, add a name in the designer and preview it before you order.']
    ]
  }
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug) || null;

export function productsInCategory(products, category) {
  return products.filter((p) => category.match.test(p.name || ''));
}

/** Best-fit theme for a product, used for "more like this" links. Skips designer-led themes. */
export function primaryCategory(product) {
  return CATEGORIES.find((c) => !c.designerLed && c.slug !== 'personalised-name-doona-covers' && c.match.test(product.name || ''))
    || CATEGORIES.find((c) => c.match.test(product.name || ''))
    || null;
}
