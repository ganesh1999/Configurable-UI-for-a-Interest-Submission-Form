import React, { Fragment, useState } from "react";
import { Select } from "@headlessui/react";
import clsx from "clsx";

interface Question {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  validation?: {
    type: string;
    minLength?: number;
    min?: number;
  };
  allowCustomInput?: boolean;
}

interface FormPageProps {
  questions: Question[];
  onChange: (name: string, value: any) => void;
}

const FormPage: React.FC<FormPageProps> = ({ questions, onChange }) => {
  const [customInput, setCustomInput] = useState<{ [key: string]: boolean }>({});
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});

  const handleSelectChange = (name: string, value: string) => {
    onChange(name, value === "other" ? customValues[name] || "" : value);
    setCustomInput((prev) => ({ ...prev, [name]: value === "other" }));
  };

  const handleCustomInputChange = (name: string, value: string) => {
    setCustomValues((prev) => ({ ...prev, [name]: value }));
    onChange(name, value);
  };

  return (
    <div className="my-10 space-y-8">
      {questions.map((question) => (
        <div className="" key={question.name}>
          <label>{question.label}{question.required && "*"} </label>
          {question.type === "text" && (
            <input
              className="mt-2 border border-blue-400 rounded px-4 py-2 focus:outline-none w-full"
              type="text"
              name={question.name}
              onChange={(e) => onChange(question.name, e.target.value)}
              required={question.required}
            />
          )}
          {question.type === "number" && (
            <input
              className="mt-2 border border-blue-400 rounded px-4 py-2 focus:outline-none w-full"
              type="number"
              name={question.name}
              onChange={(e) => onChange(question.name, e.target.value)}
              required={question.required}
            />
          )}
          {question.type === "select" && (
            <Select as={Fragment}>
              {({ focus, hover }) => (
                <select
                  className={clsx(
                    "w-full px-4 py-2 border border-blue-400 rounded mt-2 focus:outline-none",
                    focus && "",
                    hover && "shadow"
                  )}
                  aria-label="Project status"
                  name={question.name}
                  onChange={(e) =>
                    handleSelectChange(question.name, e.target.value)
                  }
                  required={question.required}
                >
                  {question.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  {question.allowCustomInput && (
                    <option key={"other"} value={"other"}>
                      Other
                    </option>
                  )}
                </select>
              )}
            </Select>
          )}
          {customInput[question.name] && (
            <input
              className="mt-2 border border-blue-400 rounded px-4 py-2 focus:outline-none w-full"
              type="text"
              name={`${question.name}-custom`}
              onChange={(e) =>
                handleCustomInputChange(question.name, e.target.value)
              }
              value={customValues[question.name] || ""}
              required={question.required}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FormPage;
