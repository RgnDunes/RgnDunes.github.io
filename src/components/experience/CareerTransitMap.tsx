import type { CSSProperties } from "react";
import Image from "next/image";
import { experiences } from "@/data/experience";

const TIMELINE_START = monthIndex("2020-08");
const TIMELINE_END = monthIndex("2026-08");
const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;

const yearTicks = [2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({
  label: String(year),
  position:
    year === 2020
      ? 0
      : ((monthIndex(`${year}-01`) - TIMELINE_START) / TIMELINE_SPAN) * 100,
}));

const primaryExperiences = experiences
  .filter((experience) => experience.track === "primary")
  .sort((a, b) => a.startDate.localeCompare(b.startDate));

const concurrentExperiences = experiences
  .filter((experience) => experience.track === "concurrent")
  .sort((a, b) => a.startDate.localeCompare(b.startDate));

function monthIndex(date: string) {
  const [year, month] = date.split("-").map(Number);
  return year * 12 + month - 1;
}

function routePosition(startDate: string, endDate?: string) {
  const start = monthIndex(startDate);
  const end = endDate ? monthIndex(endDate) + 1 : TIMELINE_END;
  return {
    "--route-start": `${((start - TIMELINE_START) / TIMELINE_SPAN) * 100}%`,
    "--route-span": `${((end - start) / TIMELINE_SPAN) * 100}%`,
  } as CSSProperties;
}

function verticalRoutePosition(startDate: string, endDate?: string) {
  const start = monthIndex(startDate);
  const end = endDate ? monthIndex(endDate) + 1 : TIMELINE_END;
  return {
    "--route-start-y": `${((start - TIMELINE_START) / TIMELINE_SPAN) * 100}%`,
    "--route-span-y": `${((end - start) / TIMELINE_SPAN) * 100}%`,
  } as CSSProperties;
}

function promotionSegments(experience: (typeof experiences)[number]) {
  if (
    !experience.previousRoles ||
    !experience.roleStartDate ||
    !experience.roleEndDate
  ) {
    return [];
  }

  return [
    ...experience.previousRoles.map((role) => ({
      endDate: role.endDate,
      label: role.position.includes("Intern") ? "Intern" : "SDE I",
      startDate: role.startDate,
    })),
    {
      endDate: experience.roleEndDate,
      label: "Senior",
      startDate: experience.roleStartDate,
    },
  ].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function monthSpan(startDate: string, endDate: string) {
  return monthIndex(endDate) - monthIndex(startDate) + 1;
}

export default function CareerTransitMap() {
  return (
    <figure className="obs-transit-map" aria-labelledby="career-map-caption">
      <figcaption id="career-map-caption">
        <span>Career route · Aug 2020 to now</span>
        <strong>
          One engineering path, with teaching and writing shown where they
          overlapped.
        </strong>
      </figcaption>

      <div className="obs-transit-desktop">
        <div className="obs-transit-axis" aria-hidden="true">
          {yearTicks.map((tick) => (
            <span key={tick.label} style={{ left: `${tick.position}%` }}>
              {tick.label}
            </span>
          ))}
          <span className="obs-transit-now">Now →</span>
        </div>

        <div className="obs-transit-row obs-transit-primary">
          <span className="obs-transit-row-label">Engineering</span>
          <div className="obs-transit-track">
            {primaryExperiences.map((experience, index) => (
              <span
                key={experience.company}
                className="obs-transit-route"
                data-label-side={index % 2 === 0 ? "above" : "below"}
                style={routePosition(experience.startDate, experience.endDate)}
              >
                <span className="obs-transit-station">
                  <span className="obs-transit-logo">
                    <Image src={experience.logo} alt="" sizes="30px" />
                  </span>
                  <span className="obs-transit-company">
                    <strong>{experience.company}</strong>
                    <small>{experience.duration}</small>
                  </span>
                </span>
                {experience.previousRoles && (
                  <span className="obs-transit-promotions" aria-hidden="true">
                    {promotionSegments(experience).map((role) => (
                      <span
                        key={role.startDate}
                        style={{
                          flex: `${monthSpan(role.startDate, role.endDate)} 1 0`,
                        }}
                      >
                        {role.label}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="obs-transit-parallel">
          <span className="obs-transit-row-label">Alongside</span>
          {concurrentExperiences.map((experience, index) => (
            <div className="obs-transit-row" key={experience.company}>
              <div className="obs-transit-track">
                <span
                  className="obs-transit-route obs-transit-route-parallel"
                  style={routePosition(
                    experience.startDate,
                    experience.endDate,
                  )}
                >
                  <span className="obs-transit-station">
                    <span className="obs-transit-logo">
                      <Image src={experience.logo} alt="" sizes="26px" />
                    </span>
                    <span className="obs-transit-company">
                      <strong>{experience.company}</strong>
                      <small>{experience.duration}</small>
                    </span>
                  </span>
                </span>
              </div>
              <span className="obs-transit-track-number" aria-hidden="true">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="obs-transit-mobile" aria-hidden="true">
        <div className="obs-transit-mobile-axis">
          {yearTicks.map((tick) => (
            <span key={tick.label} style={{ top: `${tick.position}%` }}>
              {tick.label}
            </span>
          ))}
          <span className="obs-transit-mobile-now">Now ↓</span>
        </div>
        <span className="obs-mobile-track-label obs-mobile-primary-label">
          Engineering
        </span>
        <span className="obs-mobile-track-label obs-mobile-parallel-label">
          Alongside
        </span>
        {primaryExperiences.map((experience, index) => (
          <span
            key={experience.company}
            className="obs-transit-mobile-route obs-transit-mobile-primary"
            data-label-side={index % 2 === 0 ? "left" : "right"}
            style={verticalRoutePosition(
              experience.startDate,
              experience.endDate,
            )}
          >
            <span className="obs-transit-logo">
              <Image src={experience.logo} alt="" sizes="24px" />
            </span>
            <span className="obs-transit-mobile-company">
              <strong>{experience.company}</strong>
              <small>{experience.duration}</small>
            </span>
          </span>
        ))}
        {concurrentExperiences.map((experience, index) => (
          <span
            key={experience.company}
            className="obs-transit-mobile-route obs-transit-mobile-parallel"
            data-label-side={index === 2 ? "left" : "right"}
            style={
              {
                ...verticalRoutePosition(
                  experience.startDate,
                  experience.endDate,
                ),
                "--parallel-left": `${60 + index * 13}%`,
              } as CSSProperties
            }
          >
            <span className="obs-transit-logo">
              <Image src={experience.logo} alt="" sizes="22px" />
            </span>
            <span className="obs-transit-mobile-company">
              <strong>{experience.company}</strong>
              <small>{experience.duration}</small>
            </span>
          </span>
        ))}
      </div>
    </figure>
  );
}
