import { useState } from "react";

const API_BASE_URL = "https://microhum-mali-nurse-rest-api.hf.space";

interface VoiceRequestBotnoi {
  audio_id: string;
  text: string;
  speaker: string;
  volume: number;
  speed: number;
  type_media: string;
  language: string;
  token?: string;
}

interface VoiceRequestVaja9 {
    text: string;
    speaker: string;
    phrase_break: number;
    audiovisual: number;
}

interface SoundGenerate {
    service?: "botnoi" | "vaja9";
    text: string;
}

export async function fetchGeneratedVoice(
    props: SoundGenerate
): Promise<Blob> {
    const { service, text } = props;
    let request: VoiceRequestBotnoi | VoiceRequestVaja9;

    if (service === "botnoi") {
        request = {
            text: text,
            audio_id: "EUOJF",
            speaker: "52",
            volume: 100,
            speed: 1,
            type_media: "mp3",
            language: "th",
        };
    } else if (service === "vaja9") {
        request = {
            text: text,
            speaker: "2",
            phrase_break: 0,
            audiovisual: 0,
        };
    } else if (service === null) {
        throw new Error(`Service cannot be null`);
    } else {
        throw new Error(`Unsupported service: ${service}`);
    }

    const response = await fetch(`${API_BASE_URL}/tts/generate_voice_${service}/`, {
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
