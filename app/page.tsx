"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getImages = async () => {
    // make a request to the OpenAI API
    setLoading(true);
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: inputValue,
        n: 3,
        size: "256x256",
      }),
    });

    const data = await res.json();
    setImages(data.data);
    setLoading(false);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getImages();
    setInputValue("");
  };
  return (
    <main>
      {/* <!-- title --> */}
      <h1 className="text-2xl sm:text-4xl text-white">Images Generator AI</h1>
      {/* <!-- images --> */}
      <div className="images grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.length ? (
          <>
            {images.map((image: { url: string }) => (
              <div key={image.url}>
                <Image
                  width={256}
                  height={256}
                  alt={image.url}
                  src={image.url}
                  className="w-full"
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <div></div>
            <div></div>
            <div></div>
          </>
        )}
      </div>
      {/* <!-- prompt --> */}
      <form
        className="prompt flex flex-col sm:flex-row w-full max-w-[500px]"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          className="w-full"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button className="w-full sm:w-32">
          {loading ? <span className="lds-hourglass"></span> : "Generate"}
        </button>
      </form>
    </main>
  );
}
