import JobListFilterSection from "../../_component/jobs/JobListFilterSection";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <JobListFilterSection />
      {children}
    </div>
  );
}

export default Layout;
