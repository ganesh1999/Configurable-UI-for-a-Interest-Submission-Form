"use client";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import FormPage from "./FormPage"; // Adjust the import path as necessary

// Define the types for the config and form data
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

interface Page {
  questions: Question[];
}

interface Config {
  timeoutThreshold: number;
  pages: Page[];
}

export default function Home() {
  const [config, setConfig] = useState<Config | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60); // 30 minutes in seconds
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // fetch form config on initial render
  useEffect(() => {
    axios
      .get("/api/getconfig")
      .then((response) => {
        console.log(response.data);
        setConfig(response.data);
        initializeFormData(response.data);
        setTimeRemaining(response.data.timeoutThreshold);
      })
      .catch((error) => console.error("Error fetching form config:", error));
  }, []);

  const initializeFormData = (config: Config) => {
    const initialData: { [key: string]: any } = {};
    config.pages.forEach((page) => {
      page.questions.forEach((question) => {
        if (question.type === "select" && question.options) {
          initialData[question.name] = question.options[0];
        } else {
          initialData[question.name] = "";
        }
      });
    });
    setFormData(initialData);
  };

  // Update the remaining time every second
  useEffect(() => {
    if (timeRemaining > 0) {
      const id = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      setTimeoutId(id);
      return () => clearInterval(id);
    } else {
      alert("Form timed out. Please start again.");
      location.reload();
    }
  }, [timeRemaining]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
    axios
      .post("/api/submitform", formData)
      .then((response) => {
        console.log("Form submitted:", response.data);
        if (response.data?.errors) {
          setErrors(response.data.errors);
        } else {
          setErrors([]);
          alert("Form submitted successfully!");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (!config)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <main>
      <div className="max-w-screen-lg mx-auto pt-20">
        <h1 className="font-semibold text-3xl text-blue-500">Submit Form:</h1>
        Time Remaining: {formatTime(timeRemaining)}
        {/* Form body */}
        <div>
          {config.pages.map((page, index) => (
            <div
              key={index}
              style={{ display: currentPage === index ? "block" : "none" }}
            >
              <FormPage questions={page.questions} onChange={handleChange} />
              <div className="flex items-center justify-end space-x-4 py-6">
                {index === config.pages.length - 1 && (
                  <Button onClick={handleSubmit}>Submit</Button>
                )}
                {index < config.pages.length - 1 && (
                  <Button onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                  </Button>
                )}
                {index > 0 && (
                  <Button onClick={() => setCurrentPage(currentPage - 1)}>
                    Back
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p>* fields are required</p>
        {/* Form Input Errors */}
        {errors.length > 0 && (
          <div className="error-list">
            <ul className="list-disc">
              {errors.map((error, index) => (
                <li className="text-red-400" key={index}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
