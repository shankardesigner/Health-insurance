import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import SurplusModule from "@containers/Modeling/ProjectedSurplus/SurplusModule";

export default function SurplusPage() {
  const moduleInfo = {
    name: "Surplus Compensation",
    header: {
      displayBack: true,
    },
  };

  return (
    <>
      <SessionLayoutWrapper type="module" info={moduleInfo}>
        <SurplusModule />
      </SessionLayoutWrapper>
    </>
  );
}
