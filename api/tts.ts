import { useState } from "react";

const API_BASE_URL = "https://microhum-mali-nurse-rest-api.hf.space";

export interface VoiceRequestBotnoi {
  audio_id: string;
  text: string;
  speaker: string;
  volume: number;
  speed: number;
  type_media: string;
  language: string;
  token?: string;
}

export async function fetchGeneratedVoice(
  text: string
): Promise<Blob> {
  const request: VoiceRequestBotnoi = {
    text: text,
    audio_id: "EUOJF",
    speaker: "52",
    volume: 100,
    speed: 1,
    type_media: "mp3",
    language: "th",
  };
  const response = await fetch(`${API_BASE_URL}/tts/generate_voice_botnoi/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voice: ${response.statusText}`);
  }

  // Return the MP3 file as a Blob
  return await response.blob();
}
