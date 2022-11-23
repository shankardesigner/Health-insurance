import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import ProjectedSurplus from "@containers/Modeling/ProjectedSurplus";

export default function ReportsPage() {
  const moduleInfo = {
    name: "Reports",
    header: {
      displayBack: true,
    },
  };

  return (
    <>
      <SessionLayoutWrapper type="module" info={moduleInfo}>
        <ProjectedSurplus />
      </SessionLayoutWrapper>
    </>
  );
}
