
# AI Color Palette Generator

A creative, AI-powered web application that generates beautiful, context-aware color palettes from text descriptions and image analysis. Describe a mood, theme, or scene, upload a photo, or combine both to create a unique set of colors for your design projects.

This project leverages the multimodal capabilities of the Google Gemini AI to understand both text and image inputs, providing nuanced and aesthetically pleasing color schemes.

## ✨ Features

-   **🎨 Text-to-Color Generation**: Describe any concept, and the AI will generate a matching 5-color palette. (e.g., "Misty forest at dawn", "Cyberpunk city nightlife").
-   **🖼️ Image-to-Color Recognition**: Upload an image, and the AI will analyze its contents, mood, and lighting to extract a harmonious color palette.
-   **🤖 Multimodal Input**: Combine an image with a text prompt for fine-tuned control. For example, upload a beach photo and add the prompt "make it feel like a vintage postcard" to guide the color selection.
-   **🖌️ Interactive Palette Display**: View the generated colors in a clean, responsive layout.
-   **📋 One-Click Copy**: Simply click on any color swatch to instantly copy its HEX code to your clipboard.
-   **💡 Smart Text Coloring**: The color name and HEX code automatically switch between light and dark text for optimal readability against the swatch background.
-   **💨 Fast & Responsive**: Built with a modern tech stack for a smooth user experience on any device, with fluid animations powered by Framer Motion.

---

## 🚀 Demonstrations

### Text-to-Color Generation

Simply type a descriptive prompt and watch the AI bring your words to life in color.

![color-gen-standart](https://github.com/user-attachments/assets/9a9aa529-120d-4c32-96c7-e3a3a482a72a)


### Image-to-Color Generation

Upload any image to extract its core color DNA. Combine it with a prompt for even more creative control.

![color-gen-image](https://github.com/user-attachments/assets/b60901c1-ca4d-4f23-93e8-2258e1d30e46)

---

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Animation**: Framer Motion
-   **Deployment**: Static web app architecture, deployable on any modern hosting platform (Vercel, Netlify, etc.).

---

## ⚙️ Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   `npm`, `yarn`, or `pnpm`
-   A Google AI API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-color-palette-generator.git
    cd ai-color-palette-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure your API Key:**
    Create a new file named `.env` in the root of the project and add your Google AI API Key:

    ```.env
    API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
    > **Note**: The application is configured to read the API key from this environment variable (`process.env.API_KEY`). It is not stored in the code or exposed to the client.

4.  **Run the development server:**
    This project is set up as a simple static site. To run it locally, you can use a simple server. If you have `vite` installed globally, you can run:
    ```bash
    vite
    ```
    Or use any other local server that can serve `index.html`.

5.  **Open the app:**
    Navigate to `http://localhost:5173` (or the URL provided by your local server) in your browser.

---

## How It Works

1.  **User Input**: The React frontend captures the user's text prompt and/or uploaded image file.
2.  **Image Processing**: If an image is provided, it's converted into a Base64 string on the client side.
3.  **API Request**: The `geminiService` constructs a multimodal request payload. This payload includes the text prompt and the Base64 image data. Crucially, it also sends a `responseSchema` to instruct the Gemini API to return data in a specific, structured JSON format (`{hex: string, name: string}`).
4.  **AI Generation**: The request is sent to the `gemini-2.5-flash` model. The model analyzes the inputs and generates a JSON array of five color objects that match the request.
5.  **Render Response**: The frontend receives the structured JSON, parses it, and dynamically renders the interactive `ColorSwatch` components for the user.
