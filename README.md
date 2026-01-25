# Clutter Analytics

> A privacy-first, lightweight web analytics platform designed to provide essential website insights without tracking personal data or compromising site performance.

---

## Vision Document

### Project Name & Overview
**Project Name:** Clutter Analytics

**Overview:** Clutter Analytics is a privacy-first, lightweight web analytics platform designed to provide essential website insights without tracking personal data or compromising site performance. It consists of a high-performance collection backend, a clean dashboard, and a minimal tracking script.

### Problem it Solves
- **Complexity:** Major analytics tools (like Google Analytics 4) are overly complex for small to medium websites.
- **Privacy:** Many tools aggregate user data across sites, raising privacy concerns.
- **Performance:** Heavy tracking scripts slow down page loads.
- **Data Ownership:** Users often don't truly own their simplified analytics data.

### Target Users (Personas)
- **Developer Dave:** Wants to add analytics to his personal blog or portfolio with a single line of code. Cares about page speed.
- **Startup Sarah:** Founder of a small SaaS who needs to know conversion sources and top pages but doesn't have a data team.
- **Privacy Paul:** A website visitor who blocks aggressive trackers but is okay with anonymous page view counting.

### Vision Statement
> "To empower website owners with simple, transparent, and fast analytics that respect user privacy."

### Key Features / Goals
- **Featherweight Tracking:** < 2KB script size.
- **Real-time Dashboard:** Instant feedback on site traffic.
- **Privacy Compliance:** No cookies, no IP logging, GDPR compliant by design.
- **Traffic Insights:** Top pages, referrers, device types, and geographic breakdowns.
- **Self-Hostable:** Open architecture allowing users to host their own instance.

### Success Metrics
- **Performance:** Tracking script load time < 50ms.
- **Scale:** Handle 1000+ requests/second on a standard node.
- **Usability:** User can set up a new site and verify tracking within 2 minutes.

### Assumptions & Constraints
- **Assumptions:** Users have access to modify their website's HTML to add the script. Browser limits (ad blockers) may affect data accuracy.
- **Constraints:** Limited historical data retention in the MVP.

---

You can view the project board [here](https://github.com/users/ThEditor/projects/1/views/1).

---

## Branching Strategy

We follow **GitHub Flow** for a simple and effective development workflow:

### Main Branch
- `main` - Production-ready code
- Always deployable
- Protected branch (requires pull request reviews)

### Feature Branches
- Created from `main` for new features or bug fixes
- Naming convention: `feature/<feature-name>` or `fix/<bug-name>`
- Examples:
  - `feature/add-login`
  - `feature/dashboard-charts`
  - `fix/event-validation`

### Workflow
1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit regularly**:
   ```bash
   git add .
   git commit -m "Add: descriptive commit message"
   ```

3. **Push to remote**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub
   - Add description of changes
   - Request review from team members
   - Ensure all checks pass

5. **Merge to main** after approval
   - Use "Squash and merge" for clean history
   - Delete feature branch after merging

### Commit Message Convention
```
Type: Short description

Types:
- Add: New feature
- Fix: Bug fix
- Update: Modify existing feature
- Refactor: Code restructuring
- Docs: Documentation changes
- Test: Add or update tests
```
