## Hidden Agents - Reddit Undercover

A social deduction game built on Reddit's Devvit platform. Players join a lobby, receive secret roles (Spy, Detective, or Citizen), and work together to uncover the Spy through night-time investigations and group votes.

### How to Play

1. **Join the Lobby** - Click "Join Game" to enter the match
2. **Role Reveal** - You'll be assigned one of three roles:
   - **Spy** - Eliminate citizens at night without being caught
   - **Detective** - Investigate players each night to find the Spy
   - **Citizen** - Discuss and vote to identify the Spy
3. **Night Phase** - Spy and Detective take secret actions
4. **Discussion** - Share intel and debate who the Spy might be
5. **Vote** - Cast your vote to eliminate a suspect
6. **Win Condition** - Citizens win by eliminating the Spy; Spy wins when they equal citizen numbers

### Tech Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform
- [Vite](https://vite.dev/): Build tool
- [React](https://react.dev/): Frontend UI
- [Hono](https://hono.dev/): Backend API
- [Tailwind CSS](https://tailwindcss.com/): Styling
- [TypeScript](https://www.typescriptlang.org/): Type safety

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build client and server
- `npm run deploy` - Upload new version
- `npm run launch` - Publish for review
- `npm run type-check` - Type check the project
