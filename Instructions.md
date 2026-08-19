# Medi-Q Project Instructions

## Updated Vision (MVP)

Medi-Q is a simple patient pre-consultation and doctor queue management system.

**Main User:** PATIENT

**Goals:**
- Reduce doctor waiting time
- Collect only important information before consultation
- Generate a queue token
- Allow doctor to view patient details using that token

---

## Patient Flow

### 1. Landing Page

The first screen should be simple and clean.

It should contain:
- Medi-Q name
- Short explanation of what it does
- Simple healthcare-focused UI
- Button: "Start Check-in"

This button opens the patient information form.

Also include:
- "Doctor Login" (only for doctors)

---

### 2. Patient Basic Information

Keep this extremely simple.

Ask only:
**Required:**
- Name
- Age
- Blood Group

**Optional:**
- Phone Number

**Do NOT ask:**
- Gender
- Email
- Address
- Extra medical information

After filling details:
Button: "Next"

---

### 3. Token Generation

After clicking Next:
Generate a random queue token.

Format:
P-01
P-02
P-03
etc.

Show clearly:
"Your Queue Number"
Example: P-07

Message:
"Please remember this number. The doctor will call you using this token."

This token is the main identifier.

---

### 4. Body Part Selection

After token generation:
Ask: "Where are you experiencing the problem?"

Show body part options:
- Head
- Eyes
- Ear
- Nose
- Throat
- Chest
- Stomach
- Hand
- Leg
- Back
- Skin
- Other

At the bottom: "Other"

If selected:
Allow user to manually enter the body part.

---

### 5. Symptom Questions

When a body part is selected:
Show relevant questions.

**Examples:**
**Head:**
- Headache?
- Dizziness?
- Duration?
- Severity?

**Chest:**
- Pain?
- Breathing difficulty?
- Duration?

The questions should depend on the selected body part.

Keep answers simple:
- Yes/No
- Dropdown
- Small text input where required

Do not try to diagnose.
Only collect information for doctor reference.

---

### 6. Submit

After completing symptoms:
Button: "Submit"

Save:
- Patient name
- Age
- Blood group
- Phone (if provided)
- Queue token
- Selected body part
- Answers

Show:
"Your check-in is complete"
Display token again.

---

## Doctor Flow

Doctor Login should exist separately.

Doctor should be able to:
1. Login
2. See queue list:
   Example:
   P-01
   Rahul
   Chest pain
   
   P-02
   Amit
   Headache
   
3. Doctor clicks a token
4. Doctor sees:
   - Patient basic details
   - Selected body part
   - Answers to questions
5. Doctor treats patients in token order.

---

## Remove Unnecessary Complexity

Do NOT build:
- Patient accounts
- Patient login
- Registration system
- Complex roles
- Elderly mode (for now)
- Multilingual system (for now)
- Analytics dashboard
- Reports
- Advanced AI diagnosis

Keep MVP simple.

---

## Technical Requirements

**Keep:**
- React + TypeScript + Tailwind frontend
- Node.js + Express backend
- MongoDB database

**Maintain:**
- Clean folder structure
- Good component separation
- Reusable components
- Proper API structure

---

## Implementation Order

Follow this order:

### Phase 1:
- Update Instructions.md
- Clean architecture
- Landing page
- Patient form
- Token generation

### Phase 2:
- Body part selection
- Dynamic symptom questions
- Save patient data

### Phase 3:
- Doctor login
- Doctor queue dashboard
- View patient details by token

### Phase 4:
- UI improvements
- Testing
- Bug fixing

---

## Development Rules

### 1. Always Follow The Plan
- The project plan is the source of truth.
- Before making any change, check if it matches the current project plan.
- Do not add random features without updating the plan first.
- If requirements change, update the plan before changing the code.
- After every major change, review the plan and confirm the project is still aligned.

### 2. Review After Every Change
After completing any modification:
1. Check what was changed.
2. Compare the change with the project plan.
3. Verify that no existing functionality was broken.
4. Update documentation if required.
5. Keep the project structure clean.
Never continue development without reviewing previous changes.

### 3. Keep The Codebase Clean
Follow a professional project structure:
- Keep files organized by purpose.
- Do not create unnecessary files.
- Remove unused code, dependencies, and assets.
- Use meaningful file and folder names.
- Keep components modular and reusable.
- Avoid duplicate code.
- Maintain consistent coding style.

### 4. Development Workflow
For every feature:
1. Understand the requirement.
2. Check the project plan.
3. Decide the best implementation approach.
4. Make the smallest clean changes possible.
5. Test the changes.
6. Review the project structure.
7. Update documentation if needed.

### 5. Avoid Technical Debt
- Do not use temporary hacks unless documented.
- Do not ignore errors.
- Fix warnings whenever possible.
- Keep dependencies updated.
- Avoid unnecessary complexity.
- Prefer simple, maintainable solutions.

### 6. Documentation Rules
Always maintain:
- README.md
- Project plan (Instructions.md)
- Setup instructions
- Environment variables documentation
- Feature documentation
Every important decision should be documented.

### 7. Testing Rules
Before marking a task complete:
- Run the project.
- Check for errors.
- Test the new feature.
- Verify existing features still work.
- Check console logs.
- Check performance where required.

### 8. Git Rules
Before committing:
- Review changed files.
- Remove unnecessary files.
- Ensure the project builds successfully.
- Write clear commit messages.

Commit format:
```
type: short description

Examples:
feat: add authentication system
fix: resolve API connection issue
docs: update setup instructions
refactor: clean component structure
```

### 9. Feature Addition Rules
Before adding a new feature:
Ask:
- Is it part of the plan?
- Does it improve the project?
- Does it introduce unnecessary complexity?
- Will it affect existing features?

If a feature is outside the plan:
1. Update the plan.
2. Explain the reason.
3. Then implement it.

### 10. Maintain Professional Standards
The final project should be:
- Clean
- Scalable
- Maintainable
- Secure
- Well documented
- Easy for another developer to understand
Always build as if the project will be handed to a professional team.