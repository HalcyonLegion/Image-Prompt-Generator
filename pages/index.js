import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [storyInput, setStoryInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story: storyInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setStoryInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Image-Generator Feeder</title>
        <link rel="icon" href="/halcyonic.png" />
      </Head>

      <main className={styles.main}>
        <img src="/halcyonic.png" className={styles.icon} />
        <h3>Create Ideas for Images to Feed the Image-Generator!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="story"
            placeholder="Enter: 'Generate Prompts for Me' here!"
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
          />
          <input type="submit" value="Generate Prompts" />
        </form>
        <div className={styles.result}>
        {result && result.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
        ))}
        </div>


      </main>
    </div>
  );
}
