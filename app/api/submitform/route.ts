import { promises as fs } from "fs";
import path from "path";

// Fetch the form data from the request
export async function POST(request: Request) {
  const formData = await request.json();

  const configPath = path.join(process.cwd(), "formconfig.json");
  const configFile = await fs.readFile(configPath, "utf-8");
  const config = JSON.parse(configFile);

  // Validate form data according to config
  const errors = validateFormData(formData, config);

  if (errors.length > 0) {
    return new Response(JSON.stringify({ errors }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Ok");
}

// Function to validate form data
function validateFormData(formData: any, config: any): string[] {
  const errors: string[] = [];

  config.pages.forEach((page: any) => {
    page.questions.forEach((question: any) => {
      const value = formData[question.name];

      if (
        question.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`${question.label} is required.`);
      }

      if (question.required && question.type === "number") {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
          errors.push(`${question.label} must be a number.`);
        }
      }

      if (
        question.required &&
        question.type === "text" &&
        typeof value !== "string"
      ) {
        errors.push(`${question.label} must be a string.`);
      }

      if (
        question.required &&
        question.type === "select" &&
        !question.allowCustomInput &&
        !question.options.includes(value)
      ) {
        errors.push(
          `${question.label} must be one of ${question.options.join(", ")}.`
        );
      }

      if (question.required && question.validation) {
        if (
          question.validation.minLength &&
          typeof value === "string" &&
          value.length < question.validation.minLength
        ) {
          errors.push(
            `${question.label} must be at least ${question.validation.minLength} characters long.`
          );
        }

        if (question.required && question.validation.min) {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue) && parsedValue < question.validation.min) {
            errors.push(
              `${question.label} must be at least ${question.validation.min}.`
            );
          }
        }
      }
    });
  });

  return errors;
}


// Given the dynamic nature of the fields and values in the form, it's indeed a good approach to save the data as a JSON object in a flexible schema. 