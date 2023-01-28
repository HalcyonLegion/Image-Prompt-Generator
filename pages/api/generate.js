import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const story = req.body.story || '';
  if (story.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(story),
      temperature: 0.7,
      max_tokens: 2048,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(story) {
  const capitalizedStory =
    story[0].toUpperCase() + story.slice(1).toLowerCase();
  return `I need you to generate about 3-6 descriptions of a subject or multiple subjects. You need to separate the descriptions by commas. Please include ideas of Colour and Art Styles as description types as well as physical descriptions.
  The subjects can be places or objects, both physical or imagined. I need three to six different descriptions to be generated.

Input: I need you to generate about 3-6 descriptions of a subject or multiple subjects. You need to separate the descriptions by commas. Please include ideas of Colour and Art Styles as description types as well as physical descriptions.
The subjects can be places or objects, both physical or imagined.

Output: 1. A majestic mountain range, with peaks covered in snow and a deep blue lake at its base. The landscape is dotted with evergreen trees and wildflowers, and the air is crisp and clean.

2. An old, crumbling castle made of grey stone and adorned with ivy. The turrets are tall and pointed, and the windows are narrow and arched. The castle sits on a hill overlooking a misty valley.

3. A vibrant and colorful city, with tall skyscrapers and busy streets. The buildings are adorned with neon lights and billboards, and the streets are filled with people from all walks of life.

4. A picturesque countryside, with rolling hills and fields of golden wheat. The sun is setting, casting a warm orange glow over the landscape. A red barn and a white farmhouse sit nestled among the fields.

5. A grand palace with marble columns and gold leaf details. The palace is surrounded by lush gardens, with fountains and sculptures dotting the landscape.

6. A tropical island with white sandy beaches, crystal clear waters, and palm trees swaying in the breeze. Colorful fish can be seen swimming in the waters, and the sound of waves crashing on the shore can be heard in the distance.

Input: Please generate more prompts in the style I gave you earlier
Output: 1. A grand, opulent ballroom with chandeliers hanging from the ceiling, marble floors, and walls adorned with gold leaf and intricate frescoes.

2. A dark, foreboding forest with twisted, gnarled trees and a thick mist that clings to the ground. The only sounds are the soft rustling of leaves and the occasional hoot of an owl.

3. A bustling street market with vendors selling spices, textiles, and handmade crafts. The air is filled with the scent of exotic foods and the sounds of bargaining and haggling.

4. An ancient temple, with weathered stone carvings and intricate statues of gods and goddesses. Incense smoke fills the air, and the sound of chanting can be heard in the distance.

5. A sleek, modern art museum with white walls, large windows, and an impressive collection of contemporary art.
A serene Japanese garden with koi ponds, cherry blossom trees, and a traditional tea house. The sound of running water and the soft chirping of birds can be heard in the background.

Input: ${capitalizedStory}
Output:`;
}
