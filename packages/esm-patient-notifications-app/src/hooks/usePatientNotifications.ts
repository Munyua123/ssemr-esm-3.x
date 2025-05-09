import { useMemo } from "react";
import useObservationData from "./useObservationData";
import { WarningIcon } from "@openmrs/esm-framework";

interface Notification {
  id: number;
  message: string;
}

const usePatientNotifications = (patientUuid?: string) => {
  const { data, isLoading, error } = useObservationData(patientUuid);

  const notifications: Notification[] = useMemo(() => {
    if (!data || !data.results || !data.results.length) return [];

    const observation = data.results[0];
    if (!observation) return [];

    let idCounter = 1;
    const notificationsList: Notification[] = [];

    const observationRules = [
      {
        condition: (obs: any) => obs.cd4Done === null || obs.cd4Done === "No",
        message: "CD4 count was not done. Please perform CD4 count.",
      },
      {
        condition: (obs: any) =>
          obs.vlResults && parseFloat(obs.vlResults) >= 1000,
        message:
          "Patient's Viral Load is Unsuppressed. Consider EAC and possible regimen change.",
      },
      {
        condition: (obs: any) => obs.tbStatus === "ND - TB Screening not done",
        message:
          "TB Screening was not done. Perform a TB screening for the patient.",
      },
      {
        condition: (obs: any) => obs.onTb === "No" && obs.tbStatus === "Pr TB - Presumptive TB",
        message: "Presumptive TB, test for Urine LAM / GeneXpert.",
      },
      {
        condition: (obs: any) =>
          obs.whoClinicalStage === "Stage 3",
        message:
          "Client has WHO Stage 3. Risk of Cryptococcal Meningitis, test for sCrAg.",
      },
      {
        condition: (obs: any) =>
          obs.whoClinicalStage === "Stage 4",
        message:
          "Client has WHO Stage 4. Risk of Cryptococcal Meningitis, test for sCrAg.",
      },
      {
        condition: (obs: any) =>
          obs.temperature != null && obs.temperature < 35,
        message:
          "Low temperature (Hypopyrexia), treat immediately",
      },
      {
        condition: (obs: any) =>
          obs.temperature > 38,
        message:
          "High temperature (Hyperpyrexia), treat immediately",
      },
      {
        condition: (obs: any) => {
          if (!obs.blood_pressure) return false;
          const parts = obs.blood_pressure.split('/');
          if (parts.length !== 2) return false;
          const systolic = parseFloat(parts[0]);
          const diastolic = parseFloat(parts[1]);
          return systolic < 90 || diastolic < 60;
        },
        message:
          "Low BP (Hypotension), treat immediately",
      },
      {
        condition: (obs: any) => {
          if (!obs.blood_pressure) return false;
          const parts = obs.blood_pressure.split('/');
          if (parts.length !== 2) return false;
          const systolic = parseFloat(parts[0]);
          const diastolic = parseFloat(parts[1]);
          return systolic > 120 || diastolic > 80;
        },
        message:
          "Elevated BP (risk of Hypertension), treat immediately",
      },
    ];

    observationRules.forEach((rule) => {
      if (rule.condition(observation)) {
        notificationsList.push({
          id: idCounter++,
          message: rule.message,
        });
      }
    });

    const indexFamilyMembers = observation.indexFamilyMembers;
    if (indexFamilyMembers && indexFamilyMembers.length > 0) {
      indexFamilyMembers.forEach((member: any) => {
        if (member.hivStatusKnown === "Unknown" && member.relationship) {
          if (member.relationship === "Child" && member.age < 15) {
            notificationsList.push({
              id: idCounter++,
              message:
                "Client has a Child with unknown HIV status, please test the child.",
            });
          } else if (member.relationship === "Sexual") {
            notificationsList.push({
              id: idCounter++,
              message:
                "Client has sexual partner with unknown HIV status, please test the contact.",
            });
          }
        }
      });
    }

    return notificationsList;
  }, [data]);

  return {
    notifications,
    isLoading,
    error,
  };
};

export default usePatientNotifications;
