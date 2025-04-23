# Font Scout - Web Application Requirements

## 1. Introduction
Font Scout is a web application designed to help users identify the fonts used on any given public website. Users will input a URL, and the application will analyze the corresponding webpage to list the detected font families and loaded font files.

## 2. Target Audience
- Web Designers
- Web Developers
- UI/UX Professionals
- Typography Enthusiasts

## 3. Functional Requirements

### 3.1. User Interface (UI)
- **FR-UI-01:** The application shall present a single-page user interface.
- **FR-UI-02:** The UI shall include a prominent input field for the user to enter a website URL.
- **FR-UI-03:** The UI shall include a button to initiate the font analysis process.
- **FR-UI-04:** The UI shall provide clear visual feedback to the user while the analysis is in progress (e.g., a loading indicator).
- **FR-UI-05:** The UI shall display the results of the font analysis in a clear and organized manner upon successful completion.
- **FR-UI-06:** The UI shall display clear and user-friendly error messages if the analysis fails or if the input is invalid.
- **FR-UI-07:** The UI shall be built using the Shadcn/ui component library, leveraging its components for input fields, buttons, cards, tables/lists, alerts, and loading states.

### 3.2. URL Input & Validation
- **FR-IN-01:** The system shall accept a web URL as input from the user via the designated input field.
- **FR-IN-02:** The system shall perform basic client-side validation to suggest the required URL format (e.g., presence of text).
- **FR-IN-03:** The system shall perform server-side validation to ensure the provided input is a syntactically valid HTTP or HTTPS URL.
- **FR-IN-04:** The system shall reject analysis attempts for invalid or non-HTTP/HTTPS URLs and inform the user via an error message (Ref: FR-UI-06).

### 3.3. Font Analysis (Backend Process)
- **FR-AN-01:** Upon receiving a valid URL, the system shall initiate a backend analysis process.
- **FR-AN-02:** The analysis process shall use a headless browser (via Playwright) to load and render the target URL.
- **FR-AN-03:** The analysis shall identify font family names actively computed for elements on the rendered page (e.g., using `window.getComputedStyle`).
- **FR-AN-04:** The analysis shall identify font files (e.g., WOFF2, WOFF, TTF) loaded by the page via network request monitoring.
- **FR-AN-05:** The analysis shall handle potential errors during page loading and analysis gracefully (e.g., navigation timeouts, DNS resolution errors, page crashes).

### 3.4. Results Display
- **FR-RS-01:** The system shall display the originally analyzed URL along with the results.
- **FR-RS-02:** The system shall display a list of unique font family names detected via computed styles (Ref: FR-AN-03).
- **FR-RS-03:** The system shall display a list of unique font file URLs detected via network monitoring (Ref: FR-AN-04).
- **FR-RS-04:** For each detected font file URL, the system should attempt to indicate the font file type (e.g., WOFF2, TTF) based on the URL extension or content type if possible.
- **FR-RS-05:** The results display shall clearly differentiate between the list of computed font family names and the list of loaded font file URLs.

## 4. Non-Functional Requirements

### 4.1. Technology Stack
- **NFR-TS-01:** The frontend and backend framework shall be Next.js (using App Router).
- **NFR-TS-02:** The UI component library shall be Shadcn/ui.
- **NFR-TS-03:** Page analysis and font detection shall utilize the Playwright library with a Chromium browser instance.
- **NFR-TS-04:** Styling shall be implemented using Tailwind CSS.

### 4.2. Performance
- **NFR-PF-01:** The user interface shall remain responsive during user input.
- **NFR-PF-02:** The analysis process duration is dependent on the target website's complexity and load time; however, the system should provide feedback (loading state) immediately upon initiation.
- **NFR-PF-03:** The backend analysis shall implement reasonable timeouts (e.g., 30-60 seconds) to prevent indefinite hangs on problematic websites.

### 4.3. Usability
- **NFR-US-01:** The application shall have a clean, simple, and intuitive user interface.
- **NFR-US-02:** Error messages shall be informative and guide the user (e.g., "Invalid URL provided", "Analysis timed out for [URL]", "Failed to load [URL]").

### 4.4. Accuracy & Limitations
- **NFR-AC-01:** The font detection should be accurate for statically defined fonts and fonts loaded via common JavaScript methods detectable within the page load lifecycle (networkidle or domcontentloaded + reasonable delay).
- **NFR-AC-02:** The system may not accurately detect fonts loaded significantly after initial page load via complex user interactions not simulated by Playwright's default navigation.
- **NFR-AC-03:** The system cannot analyze pages requiring authentication or protected by aggressive anti-bot mechanisms that block Playwright.

### 4.5. Error Handling
- **NFR-EH-01:** Backend errors during Playwright execution (timeouts, navigation failures, etc.) shall be caught and result in a user-facing error message, not application crashes.
- **NFR-EH-02:** Network errors between the frontend and backend API shall be handled gracefully by the frontend, displaying an appropriate error message.
