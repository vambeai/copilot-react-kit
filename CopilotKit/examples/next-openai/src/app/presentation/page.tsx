"use client";
import { CopilotKit, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
import "./styles.css";
import { Presentation } from "./components/main/Presentation";
import { useState } from "react";

export default function AIPresentation() {
  const [performResearch, setPerformResearch] = useState(false);

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit/openai"
      transcribeAudioUrl="/api/transcribe"
      textToSpeechUrl="/api/tts"
    >
      <div
        style={
          {
            height: `100vh`,
            "--copilot-kit-primary-color": "#222222",
          } as CopilotKitCSSProperties
        }
      >
        <CopilotSidebar
          instructions={
            "Help the user create and edit a powerpoint-style presentation." +
            (!performResearch
              ? " No research is needed. Do not perform any research."
              : " Perform research on the topic.")
          }
          defaultOpen={true}
          labels={{
            title: "Presentation Copilot",
            initial: "Hi you! 👋 I can help you create a presentation on any topic.",
          }}
          clickOutsideToClose={false}
        >
          <Presentation performResearch={performResearch} setPerformResearch={setPerformResearch} />
        </CopilotSidebar>
      </div>
    </CopilotKit>
  );
}
