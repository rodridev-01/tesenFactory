import { useState } from "react";
import StepsTimeline from "./layout/TimeLine";

import Recepcion from "./orden/Recepcion";
import Diagnostico from "./orden/Diagnostico";
import Repuestos from "./orden/Repuestos";
import Ejecucion from "./orden/Ejecucion";
import Entrega from "./orden/Entrega";
import Archivados from "./orden/Archivados";

const steps = [
  "RECEPCION",
  "DIAGNOSTICO",
  "REPUESTOS",
  "EJECUCION",
  "ENTREGA",
  "ARCHIVADOS"
];

function OrdersLayout() {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Recepcion />;
      case 1: return <Diagnostico />;
      case 2: return <Repuestos />;
      case 3: return <Ejecucion />;
      case 4: return <Entrega />;
      case 5: return <Archivados />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      
      {/* Timeline */}
      <StepsTimeline 
        steps={steps}
        currentStep={currentStep}
        onChangeStep={setCurrentStep}
      />

      {/* Contenido */}
      <div className="flex-1 p-4 overflow-auto">
        {renderStep()}
      </div>

    </div>
  );
}

export default OrdersLayout;