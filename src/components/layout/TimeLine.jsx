import "../../assets/styles/MainLayout.css";

function StepsTimeline({ steps, currentStep, onChangeStep }) {
  return (
    <div className="steps-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-item ${index === currentStep ? "active" : ""}`}
          onClick={() => onChangeStep(index)}
        >
          <span className="step-number">{index + 1}</span>
          <span className="step-text">{step}</span>
        </div>
      ))}
    </div>
  );
}

export default StepsTimeline;