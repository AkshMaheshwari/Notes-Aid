"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ThemeProvider } from "next-themes";
import ModuleCard from "../components/ModuleCard";
import TopicList from "../components/TopicList";
import Navbar from "../components/Navbar";
import NotesData from "../notes/data";
import pyqLinks from "../notes/pyq";

interface Topic {
  title: string;
  description: string;
  videos?: {
    title: string;
    url: string;
  }[];
  notes?: {
    title: string;
    url: string;
  }[];
}

interface Module {
  [key: number]: {
    notesLink: string[];
    topics: Topic[];
  };
}

interface Subject {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  modules: Module;
}

interface Subjects {
  [subjectKey: string]: Subject;
}

interface SemesterData {
  [key: string]: Subjects;
}

interface BranchData {
  [key: string]: SemesterData;
}

interface NotesDataType {
  [year: string]: BranchData;
}

const EngineeringCurriculum: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const searchParam = useSearchParams();
  const branch = searchParam.get("branch") || "";
  const sem = searchParam.get("sem") || "";
  // console.log(branch, sem)

  const typedNotesData = NotesData as NotesDataType;

  const subjects = slug && typedNotesData[slug]?.[branch]?.[sem];
  const pyq = pyqLinks[slug];
  // console.log(pyq)
  // const subjects = NotesData.fy.comps.oddSem;

  const initialSubject = subjects ? Object.keys(subjects)[0] : "";
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedModule, setSelectedModule] = useState<number>(1);

  useEffect(() => {
    if (subjects && selectedSubject) {
      const firstModuleKey = Object.keys(
        subjects[selectedSubject]?.modules || {}
      )[0];
      setSelectedModule(firstModuleKey ? parseInt(firstModuleKey) : 1);
    }
  }, [selectedSubject, subjects]);

  if (!subjects || Object.keys(subjects).length === 0) {
    return (
      <ThemeProvider attribute="class">
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
          <Navbar />
          <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-6">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-lg md:text-2xl font-bold mb-4 text-black dark:text-white">
                No Subjects Found
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                It seems there are no subjects available for the selected
                curriculum. Will be added soon
              </p>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
        <Navbar />
        <div className="w-full p-4 md:p-6">
          <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="text-lg md:text-2xl font-bold mb-2 text-black dark:text-white">
                Engineering Curriculum of {branch.toUpperCase()} /{" "}
                {slug.toUpperCase()} /{" "}
                {sem.charAt(0).toUpperCase() + sem.slice(1)}
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Explore subjects and their module-wise topics
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
              {Object.entries(subjects).map(([key, subject]) => {
                const Icon = subject.icon;
                // console.log(subject)
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedSubject(key);
                      const firstModuleKey = Object.keys(
                        subjects[key]?.modules || {}
                      )[0];
                      setSelectedModule(
                        firstModuleKey ? parseInt(firstModuleKey) : 1
                      );
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex-1 max-w-[120px] sm:max-w-[150px] md:max-w-none text-center 
                      ${
                        selectedSubject === key
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                          : "bg-blue-200 dark:bg-blue-800 hover:border-blue-200 dark:hover:border-blue-700"
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2 flex-col">
                      <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                      <h3 className="font-medium text-black dark:text-white text-sm md:text-base">
                        {subject.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                      {Object.keys(subject.modules).length} modules
                    </p>
                  </div>
                );
              })}
            </div>

            {Object.keys(pyq).length > 0 &&
              pyq.map((pyq, index) => {
                return (
                  <div
                    className="p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm mb-4"
                    key={index}
                  >
                    <h2 className="text-sm md:text-base font-bold mb-2 text-black dark:text-white">
                      Important Links
                    </h2>
                    <a
                      href={pyq.url}
                      target="_blank"
                      className="inline-block px-4 py-2 mt-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
                    >
                      {pyq.title}
                    </a>
                  </div>
                );
              })}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-3">
                {Object.keys(subjects[selectedSubject].modules).map(
                  (moduleKey) => {
                    const moduley = parseInt(moduleKey);
                    return (
                      <ModuleCard
                        key={moduley}
                        module={moduley}
                        topics={
                          subjects[selectedSubject].modules[moduley].topics
                            .length
                        }
                        isActive={selectedModule === moduley}
                        onClick={() => setSelectedModule(moduley)}
                      />
                    );
                  }
                )}
              </div>

              <div className="md:col-span-2 bg-slate-50 dark:bg-gray-900 rounded-lg p-4 md:p-6">
                <h2 className="text-base md:text-lg font-bold mb-1 text-black dark:text-white">
                  {subjects[selectedSubject].name} - Module{" "}
                  {selectedModule || 1}
                </h2>
                <p className=" text-red-500 mb-4">
                  These videos are added with respect to the college notes, So
                  you are requested to refer the college notes as well.
                </p>
                <TopicList
                  topics={
                    subjects[selectedSubject].modules[selectedModule].topics ||
                    []
                  }
                  notesLink={
                    subjects[selectedSubject].modules[selectedModule]
                      .notesLink || []
                  }
                  moduleNumber={selectedModule || 1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EngineeringCurriculum;
