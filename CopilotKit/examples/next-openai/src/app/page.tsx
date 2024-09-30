import { CopilotKit } from "@copilotkit/react-core";
import { VacationList } from "./components/vacation-list";

export default function WaterBnb() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
        <VacationList />
    </CopilotKit>
  );
}
