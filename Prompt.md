# AI Collaboration Challenge - Bulk Operations Feature

## Feature Request
Add a bulk operations feature that allows users to select multiple products and perform batch actions (price updates, category changes, deletion) with confirmation dialogs and undo functionality.

## 1. AI Tool Selection

**Which AI tool would you choose and why?**

I would choose **GitHub Copilot** with the **Claude Opus 4.5** model.

Copilot integrates directly into the IDE and understands the full project context, including file structure, imports, and existing code patterns. This allows it to suggest accurate changes, refactor code, and implement features directly within the codebase rather than giving isolated snippets.

Claude Opus 4.5 is particularly strong for coding tasks and agent-style workflows. It handles larger context windows well, follows multi-step instructions reliably, and maintains continuity across conversations, which helps with complex refactors or feature development.

Together, they provide faster iteration, better contextual understanding, and more practical, in-editor assistance for day-to-day development.

## 2. Comprehensive Prompt

**Write your complete prompt including context about the codebase architecture and any constraints:**

**Objective:** Develop a bulk operations feature for an e-commerce platform that enables users to select multiple products and perform batch actions including price updates, category changes, and deletion. The feature must include confirmation dialogs and an undo functionality for user actions.

**Requirements:**

1. **User Interface:**
   - Design a user-friendly interface that allows users to easily select multiple products (checkboxes or multi-select dropdown).
   - Implement a clear display of selected products, including essential details (name, current price, category).

2. **Batch Actions:**
   - Provide options for the following actions:
     - Price Updates: Allow users to enter a new price or apply a percentage increase/decrease.
     - Category Changes: Enable users to reassign selected products to a different category from a dropdown list.
     - Deletion: Include an option to delete selected products (with a warning about permanent removal).

3. **Confirmation Dialogs:**
   - For each batch action, implement a confirmation dialog that summarizes the selected products and the intended action.
   - The dialog should require user confirmation to proceed with the action, minimizing accidental changes.

4. **Undo Functionality:**
   - After executing a batch action, provide an option for users to undo the last action performed.
   - The undo feature should revert the products to their prior state (original price, original category, or restored from deletion).
   - Clearly communicate the available time frame for undoing actions.

5. **Error Handling:**
   - Ensure robust error handling for each action (e.g., invalid prices, category not found, deletion of non-existing products).
   - Provide user-friendly error messages to guide users in correcting any issues that arise.

6. **Performance Considerations:**
   - Optimize the bulk operations for efficiency to handle large volumes of products without significant delays.
   - Implement loading indicators while the batch operations are being processed.

7. **Testing and Validation:**
   - Create a comprehensive testing plan to validate the functionality of the bulk operations feature, including edge cases.
   - Ensure user acceptance testing is conducted to gather feedback and refine the feature based on user experience.

8. **Documentation:**
   - Provide clear documentation and tooltips within the user interface to assist users in understanding how to use the bulk operations feature effectively.

## 3. Collaboration Approach

**How would you iterate and collaborate with the AI tool to implement this feature?**

I would collaborate with the AI tool iteratively to implement this feature. First, I would provide the AI with all relevant context, including project structure, Figma prototypes, design specs, and documentation from MCP Servers Context 7, so it fully understands the requirements.

I would then work with GitHub Copilot (powered by Claude Opus 4.5) to generate code snippets, implement functions, and integrate them directly into the codebase, ensuring consistency with existing patterns. After reviewing and testing the AI’s suggestions, I would refine and optimize them, using the AI as a pair programmer to accelerate development while maintaining control over the final implementation.

This approach allows rapid iteration, accurate feature implementation, and seamless alignment with the design and documentation.