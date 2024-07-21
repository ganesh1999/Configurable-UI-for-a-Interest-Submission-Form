
# Configurable-UI-for-a-Interest-Submission-Form

A dynamic form creation application.




## Run Locally

Clone this repository and follow steps: (requires nodejs 17+)

```bash
  git clone https://github.com/ganesh1999/Configurable-UI-for-a-Interest-Submission-Form.git
  cd Configurable-UI-for-a-Interest-Submission-Form
  npm install
  npm run build
  npm start
```
    
## Configure formconfig.json

The form configuration JSON file is used to dynamically generate a form with multiple pages and various types of input fields. Below is an example of the JSON structure:

```bash
  {
  "timeoutThreshold": 1800,
  "pages": [
    {
      "questions": [
        {
          "name": "name",
          "label": "Name",
          "type": "text",
          "required": true,
          "validation": {
            "type": "string",
            "minLength": 1
          }
        },
        {
          "name": "gender",
          "label": "Gender",
          "type": "select",
          "required": true,
          "allowCustomInput": false,
          "options": ["M", "F", "Nonbinary"]
        },
        {
          "name": "age",
          "label": "Age",
          "type": "number",
          "required": true,
          "validation": {
            "type": "number",
            "min": 0
          }
        }
      ]
    },
    {
      "questions": [
        {
          "name": "profession",
          "label": "Profession",
          "type": "select",
          "required": true,
          "options": ["Owner", "Agent", "Buyer", "Seller"],
          "allowCustomInput": true
        },
        {
          "name": "services",
          "label": "What services do you need?",
          "type": "text",
          "required": false
        }
      ]
    }
  ]
}

```

- timeoutThreshold: This defines the time limit (in seconds) for filling out the form. Once the time runs out, the form will reset.

- pages: This is an array of page objects. Each page contains an array of questions.

- questions: Each question object represents a form field and has the following properties:

    - name: A unique identifier for the form field.
    - label: The label text displayed for the form field.
    - type: The type of the form field (e.g., "text", "select", "number").
    - required: A boolean indicating whether the field is mandatory.
    - validation: An optional object specifying validation rules for the field.
        - type: The data type of the field value.
        - minLength: The minimum length for string fields (applicable for "text" type).
        - min: The minimum value for number fields (applicable for "number" type).
    - options: An array of options for select fields (applicable for "select" type).
    - allowCustomInput: A boolean indicating if custom input is allowed for select fields (applicable for "select" type).

You can edit the questions and number of pages accordingly.
Thank you!