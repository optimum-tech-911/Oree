import { lazy, Suspense } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { OpsLayout } from "@/components/layout/OpsLayout";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { ConsentBanner } from "@/features/consent/ConsentBanner";

const SmartAssistant = lazy(() => import("@/components/assistant/SmartAssistant").then((module) => ({ default: module.SmartAssistant })));
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const AcquisitionLandingPage = lazy(() => import("@/pages/public/AcquisitionLandingPage"));
const ChooseStatusPage = lazy(() => import("@/pages/public/ChooseStatusPage"));
const HowItWorksPage = lazy(() => import("@/pages/public/HowItWorksPage"));
const OffersPage = lazy(() => import("@/pages/public/OffersPage"));
const AccompanimentPage = lazy(() => import("@/pages/public/AccompanimentPage"));
const AppointmentPage = lazy(() => import("@/pages/public/AppointmentPage"));
const DiagnosticPage = lazy(() => import("@/pages/public/DiagnosticPage"));
const NotFoundPage = lazy(() => import("@/pages/public/NotFoundPage"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const AuthCallbackPage = lazy(() => import("@/pages/auth/AuthCallbackPage"));
const LegalPage = lazy(() => import("@/pages/legal/LegalPage"));
const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const ProjectPage = lazy(() => import("@/pages/app/ProjectPage"));
const OrientationPage = lazy(() => import("@/pages/app/OrientationPage"));
const AssociatesPage = lazy(() => import("@/pages/app/AssociatesPage"));
const DocumentsPage = lazy(() => import("@/pages/app/DocumentsPage"));
const FormalitiesPage = lazy(() => import("@/pages/app/FormalitiesPage"));
const TrackingPage = lazy(() => import("@/pages/app/TrackingPage"));
const MessagesPage = lazy(() => import("@/pages/app/MessagesPage"));
const AppointmentsPage = lazy(() => import("@/pages/app/AppointmentsPage"));
const SettingsPage = lazy(() => import("@/pages/app/SettingsPage"));
const NotificationsPage = lazy(() => import("@/pages/app/NotificationsPage"));
const OpsDashboardPage = lazy(() => import("@/pages/ops/OpsDashboardPage"));
const OpsSectionPage = lazy(() => import("@/pages/ops/OpsSectionPage"));
const OpsHelpPage = lazy(() => import("@/pages/ops/OpsHelpPage"));
const OpsProfilePage = lazy(() => import("@/pages/ops/OpsProfilePage"));
const OpsInboxPage = lazy(() => import("@/pages/ops/OpsInboxPage"));
const OpsAnalyticsPage = lazy(() => import("@/pages/ops/OpsAnalyticsPage"));
const OpsAuditPage = lazy(() => import("@/pages/ops/OpsAuditPage"));

function AssistantGate() {
  const { pathname } = useLocation();
  if (["/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"].includes(pathname) || pathname.startsWith("/auth/")) return null;
  return <Suspense fallback={null}><SmartAssistant /></Suspense>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="comment-ca-marche" element={<HowItWorksPage />} />
          <Route path="offres" element={<Navigate to="/tarifs" replace />} />
          <Route path="tarifs" element={<OffersPage />} />
          <Route path="accompagnement" element={<AccompanimentPage />} />
          <Route path="choisir-statut" element={<ChooseStatusPage />} />
          <Route path="diagnostic" element={<DiagnosticPage />} />
          <Route path="rendez-vous" element={<AppointmentPage />} />
          <Route path="creation-sasu" element={<AcquisitionLandingPage slug="creation-sasu" />} />
          <Route path="creation-eurl" element={<AcquisitionLandingPage slug="creation-eurl" />} />
          <Route path="creation-sas" element={<AcquisitionLandingPage slug="creation-sas" />} />
          <Route path="creation-sarl" element={<AcquisitionLandingPage slug="creation-sarl" />} />
          <Route path="creer-entreprise-seul" element={<AcquisitionLandingPage slug="creer-entreprise-seul" />} />
          <Route path="creer-entreprise-a-plusieurs" element={<AcquisitionLandingPage slug="creer-entreprise-a-plusieurs" />} />
          <Route path="creer-entreprise-en-etant-salarie" element={<AcquisitionLandingPage slug="creer-entreprise-en-etant-salarie" />} />
          <Route path="creer-entreprise-demandeur-emploi" element={<AcquisitionLandingPage slug="creer-entreprise-demandeur-emploi" />} />
          <Route path="passer-micro-entreprise-en-societe" element={<AcquisitionLandingPage slug="passer-micro-entreprise-en-societe" />} />
          <Route path="dossier-creation-entreprise-bloque" element={<AcquisitionLandingPage slug="dossier-creation-entreprise-bloque" />} />
          <Route path="confidentialite" element={<LegalPage type="privacy" />} />
          <Route path="mentions-legales" element={<LegalPage type="legal" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="connexion" element={<AuthPage mode="login" />} />
        <Route path="inscription" element={<AuthPage mode="register" />} />
        <Route path="mot-de-passe-oublie" element={<AuthPage mode="forgot" />} />
        <Route path="reinitialiser-mot-de-passe" element={<AuthPage mode="reset" />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route path="auth/confirmation" element={<AuthCallbackPage />} />

        <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="projet" element={<ProjectPage />} />
          <Route path="orientation" element={<OrientationPage />} />
          <Route path="associes" element={<AssociatesPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="formalites" element={<FormalitiesPage />} />
          <Route path="suivi" element={<TrackingPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="rendez-vous" element={<AppointmentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="parametres" element={<SettingsPage />} />
        </Route>

        <Route path="ops" element={<ProtectedRoute roles={["advisor", "admin"]}><OpsLayout /></ProtectedRoute>}>
          <Route index element={<OpsDashboardPage />} />
          <Route path="leads" element={<OpsSectionPage section="leads" />} />
          <Route path="projets" element={<OpsSectionPage section="projets" />} />
          <Route path="documents" element={<OpsSectionPage section="documents" />} />
          <Route path="rendez-vous" element={<OpsSectionPage section="rendez-vous" />} />
          <Route path="equipe" element={<OpsSectionPage section="equipe" />} />
          <Route path="messages" element={<OpsInboxPage />} />
          <Route path="analytics" element={<OpsAnalyticsPage />} />
          <Route path="audit" element={<OpsAuditPage />} />
          <Route path="aide" element={<OpsHelpPage />} />
          <Route path="profil" element={<OpsProfilePage />} />
        </Route>
      </Routes>
      <AssistantGate />
      <ConsentBanner />
    </Suspense>
  );
}
