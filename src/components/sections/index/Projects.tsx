import Button from "../../Button";
import ProjectCard from "../../ProjectCard";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Projects() {
    //set to true by default for now because there aren't enough projects to warrant a show more button
    const [showAll, setShowAll] = useState(true);

  return (
      <>
        <section id='projects' className="max-w-4xl w-full flex flex-col mx-auto">
          <motion.h1
              className="text-center font-bold text-5xl mt-16 -mb-2"
              initial={{ transform: 'translateY(-30px)', opacity: 0 }}
              whileInView={{ transform: 'translateY(0px)', opacity: 100 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.39, 0.21, 0.12, 0.96], }}
              viewport={{ amount: 0.1, once: true }}
          >
            Projects
          </motion.h1>
            <ul className={`${showAll ? '' : 'max-h-[100rem]'} grid md:grid-cols-2 pt-6 pb-1 grid-cols-1 gap-4 overflow-hidden`}>
                {!showAll &&
                    <div className="absolute flex justify-center bottom-[5rem] z-10 bg-gradient-to-t from-background pb-8 pt-32 max-w-4xl w-full">
                        <Button label="Show More" onClick={() => setShowAll(true)} width="w-[10rem]" />
                    </div>
                }

              {/* 1. Litter Critter — MakeMIT 2026 1st Place */}
              <ProjectCard
                  url="https://devpost.com/software/smart-bin-z83asr"
                  title="Litter Critter"
                  fullDescription={[
                      "Litter Critter is an autonomous litter-collecting robot that won 1st Place in the Sustainability Track at MakeMIT x Harvard 2026, a 24-hour hardware hackathon at MIT.",
                      "The robot uses computer vision (Anthropic API) to detect waste, navigates toward it using a custom DC-motor drivetrain, and picks it up with a VIAM robotic arm. It then sorts each item into the correct receptacle — trash, recycling, or compost.",
                      "Hardware: VIAM arm with servos, 80/20 aluminum chassis, Raspberry Pi 4, Seeed Studio servo driver, DC motors. Software: Python, Anthropic API for object recognition, VIAM SDK for arm control. Fabrication: 3D printing and laser cutting, all built in 24 hours."
                  ]}
                  cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/v1772132626/SpyLogger_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_1_dc8vyw.png"
                  cardDescription="Autonomous robot that detects, collects, and sorts litter using CV and a robotic arm. 1st Place — MakeMIT x Harvard 2026."
                  media={[
                      "https://res.cloudinary.com/dygcwhekh/video/upload/v1772132640/2026-02-26_12.52.40_j3jke9.mp4",
                      "https://res.cloudinary.com/dygcwhekh/image/upload/v1772132626/SpyLogger_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_1_dc8vyw.png",
                      "https://res.cloudinary.com/dygcwhekh/image/upload/v1772132655/SpyLogger_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_ud4xzb.png"
                  ]}
                  myRole="Software Developer"
                  timeline="February 2026"
                  delay={0.1}
                  gradient="bg-gradient-to-br"
              />

              {/* 2. AutoStickers */}
              <ProjectCard
                    url="https://t.me/Auto_Stickers_bot"
                    title="AutoStickers"
                    fullDescription={[
                        "[ARCHIVED] AutoStickers was a high-speed Telegram bot that automatically purchased new sticker packs the moment they dropped on the official store. It authenticated against the store using JWT-based sessions and implemented a custom automation flow to bypass anti-bot measures for rapid checkout.",
                        "The service operated on a 20% commission model and handled over $152k in total purchase volume with around 2300 users. It integrated the Telegram Bot API for user flows and a dedicated database for users, orders, and accounting.",
                        "The project is no longer relevant after @sticker_community switched to a randomized allocation system, making instant purchases infeasible."
                    ]}
                    cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/v1755166393/SpyLogger_1920x920_2_i4o1pe.png"
                    cardDescription="High-speed Telegram bot that auto-buys new NFT sticker packs the moment they drop. Served ~2300 users and processed $152k in volume."
                    media={["https://res.cloudinary.com/dygcwhekh/image/upload/v1755166393/SpyLogger_1920x920_2_i4o1pe.png"]}
                    myRole="Founder, Developer"
                    timeline="June 2025 - July 2025"
                    delay={0.15}
                    gradient="bg-gradient-to-tl"
                />

              {/* 3. SpyLogger Bot */}
              <ProjectCard
                    url="https://t.me/SpyLogger_bot?start=_tgr_cKJHP1swYjYy"
                    title="SpyLogger Bot"
                    fullDescription={[
                        "SpyLogger is an advanced Telegram bot designed to track message edits and deletions in users' chats, featuring real-time notifications for any message modifications. Built with Python using aiogram and asyncio, it leverages Telegram's API to monitor message changes securely.",
                        "The bot implements complex message tracking logic, handling various media types including text, photos, videos, voice messages, and files. It includes a sophisticated subscription system with referral rewards and premium features, all managed through a MongoDB database.",
                        "Key technical features include asynchronous message processing, robust error handling, automated database backups, and multilingual support with Russian and English localizations. The bot also incorporates a payment system integration for subscription management and uses environment variables for secure configuration."
                    ]}
                    cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/v1737624048/SpyLogger_1920x920_mhsgts.jpg"
                    cardDescription="Telegram bot for tracking message edits and deletions, featuring real-time notifications, subscription management, and more."
                    media={[
                        "https://res.cloudinary.com/dygcwhekh/image/upload/v1737624048/SpyLogger_1920x920_mhsgts.jpg",
                        "https://res.cloudinary.com/dygcwhekh/video/upload/v1737665632/SpyLogger_1920x920_h8yvol.mp4",
                        "https://res.cloudinary.com/dygcwhekh/video/upload/v1737665630/SpyLogger_1920x920_1_ukxal7.mp4",
                        "https://res.cloudinary.com/dygcwhekh/video/upload/v1737665665/SpyLogger_1920x920_2_py7e7n.mp4"
                    ]}
                    myRole="Founder, Developer"
                    timeline="December 2024 - Present"
                    delay={0.2}
                    gradient="bg-gradient-to-br"
                />

              {/* 4. Gifts Alert Bot */}
              <ProjectCard
                    url="https://t.me/GiftsAlertBot"
                    title="Gifts Alert Bot"
                    fullDescription={[
                        "Gifts Alert Bot automates tracking of Telegram \"gifts\" and republishes them to channels you connect. It targets creators and community managers who need timely, standardized announcements.",
                        "Users connect their channels via Telegram's chat-sharing flow. The system assigns worker accounts as admins to enable message posting and editing. Per-channel options include toggling upgrades and emoji formatting, plus a built-in test to validate setup.",
                        "The backend is Python-based using Aiogram 3 for the bot and Pyrogram userbot sessions for detection. Independent loops (GiftDetector and PackDetector) stream events to a notifications layer, with asyncio for concurrency and graceful shutdown. PostgreSQL stores user and channel settings.",
                        "Monetization uses Telegram Stars with monthly and lifetime plans. The architecture supports scaling via multiple userbot sessions (SESSION_COUNT), centralized logging, and fine-grained sleep intervals to respect rate limits."
                    ]}
                    cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/v1755167217/SpyLogger_1920x920_3_t0ore1.png"
                    cardDescription="Telegram bot that detects gifts/upgrades and auto-posts alerts to your channels with Stars subscriptions."
                    media={["https://res.cloudinary.com/dygcwhekh/image/upload/v1755167217/SpyLogger_1920x920_3_t0ore1.png"]}
                    myRole="Developer"
                    timeline="August 2025 - Present"
                    delay={0.1}
                    gradient="bg-gradient-to-bl"
                />

              {/* 5. SolveStream */}
              <ProjectCard
                  url="https://solvestream.org/"
                  title="SolveStream"
                  fullDescription={[
                      "[ARCHIVED] SolveStream aimed to pair students with experts via real-time video to solve academic problems. Despite building core flows and UI, the project is no longer maintained due to time constraints."
                  ]}
                  cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169401/lukres.dev/8ihmkcad.png"
                  cardDescription="A revolutionary academic platform connecting students and professors via real-time video calls to solve educational challenges."
                  media={[
                      "https://res.cloudinary.com/dygcwhekh/video/upload/f_auto,q_auto,vc_auto/v1734169413/lukres.dev/k71k3l2g.mp4",
                      "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169401/lukres.dev/8ihmkcad.png",
                      "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169417/lukres.dev/wu26jwvh.png",
                      "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169410/lukres.dev/izj999we.png",
                      "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169405/lukres.dev/bnxrty92.png"
                  ]}
                  myRole="Founder, Developer"
                  timeline="June 2024 - May 2025"
                  delay={0.15}
                  gradient="bg-gradient-to-br"
              />

              {/* 6. Astro */}
              <ProjectCard
                    url="https://t.me/AstroStarUpdates"
                    title="Astro"
                    fullDescription={[
                        "[ARCHIVED] Astro is a specialized Telegram bot and WebApp that provides users with discounted Telegram Premium subscriptions and Stars purchases. Built with Node.js for the backend, Next.js for the WebApp interface, and Python for the Telegram bot integration, it offers a seamless purchasing experience directly within Telegram.",
                        "The service features a comprehensive referral system where users earn 5% commission from purchases made by referred contacts. It supports multiple payment methods including TON cryptocurrency and CrystalPay, with secure transaction verification and processing to prevent fraud.",
                        "Key technical features include real-time price calculations based on current exchange rates, secure payment processing with MongoDB transaction tracking, responsive WebApp interface designed for mobile use, and a robust user management system that handles referrals, commissions, and purchase history tracking."
                    ]}
                    cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/v1744360593/lukres.dev/rnsauhorwcrzvxuxauqy.png"
                    cardDescription="Telegram bot and WebApp for purchasing discounted Telegram Premium and Stars with referral rewards."
                    media={[
                        "https://res.cloudinary.com/dygcwhekh/image/upload/v1744360593/lukres.dev/rnsauhorwcrzvxuxauqy.png",
                        "https://res.cloudinary.com/dygcwhekh/image/upload/v1744360895/lukres.dev/lslzikyirwrpi2kiyn07.png"
                    ]}
                    myRole="Founder, Developer"
                    timeline="March 2025 - June 2025"
                    delay={0.2}
                    gradient="bg-gradient-to-tr"
                />

              {/* 7. Phishing Website Detector */}
              <ProjectCard
                url="https://phishing.lukres.dev/"
                title="Phishing Website Detector"
                fullDescription={[
                  "Phishing Website Detector is an advanced web tool that helps users identify potentially harmful websites. With real-time URL scanning and analysis, it provides insights into whether a site is safe to use or poses a phishing risk. By checking patterns, blacklists, and various security markers, it ensures that users can navigate the internet with an extra layer of protection. Whether you're a casual user or a security professional, this tool simplifies the process of keeping your online experience safe."
                ]}
                cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169280/lukres.dev/6ae5hg1z.png"
                cardDescription="A web tool designed to detect and analyze phishing websites in real-time, protecting users from falling victim to online fraud."
                media={[
                    "https://res.cloudinary.com/dygcwhekh/video/upload/f_auto,q_auto,vc_auto/v1734169381/lukres.dev/vamnhb8m.mp4",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169280/lukres.dev/6ae5hg1z.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169375/lukres.dev/tge4kxtr.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169327/lukres.dev/dj9uuxer.png"
                ]}
                myRole="Founder, Developer"
                timeline="May 2024 - August 2024"
                delay={0.1}
                gradient="bg-gradient-to-bl"
              />

              {/* 8. Microfluidics reactor */}
              <ProjectCard
                url="https://lukres.dev/projects/microfluidics"
                title="Microfluidics reactor"
                fullDescription={[
                  "This CAS project centers around the development of a microfluidics droplet-based reactor, a sophisticated device designed for chemical and biological reactions at a microscopic scale. The project involved creating a precise peristaltic pump system and custom silica chips to enable the formation of liposomes, small artificial vesicles used in drug delivery and other biological research. The reactor offers immense potential in research fields, especially where precision and scalability are key. Despite facing material constraints, the project successfully overcame obstacles, producing a functional and innovative system."
                ]}
                cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169330/lukres.dev/h174xqqs.jpg"
                cardDescription="An innovative CAS project focused on engineering a microfluidics droplet-based reactor for scientific applications."
                media={[
                  "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169330/lukres.dev/h174xqqs.jpg"
                ]}
                myRole="Co-Founder, Engineer"
                timeline="November 2023 - July 2024"
                delay={0.15}
                gradient="bg-gradient-to-tr"
              />

              {/* 9. RubberDucky Payloads */}
              <ProjectCard
                url="https://payloads.lukres.dev"
                title="RubberDucky Payloads"
                fullDescription={[
                  "RubberDucky Payloads is a curated collection of powerful scripts designed for use with RubberDucky, an iconic USB hacking tool. These scripts, which have been tested on the versatile Flipper Zero device, enable penetration testers and cybersecurity enthusiasts to perform tasks such as keystroke injection, network reconnaissance, and more. Each payload is crafted to demonstrate security vulnerabilities in a safe and educational environment, making it ideal for those learning about ethical hacking and cybersecurity. The collection emphasizes learning and hands-on experience in a controlled setting."
                ]}
                cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169284/lukres.dev/85nw8ufg.png"
                cardDescription="A collection of custom RubberDucky scripts tested on Flipper Zero, designed for educational purposes and security research."
                media={[
                  "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169284/lukres.dev/85nw8ufg.png"
                ]}
                myRole="Founder, Developer"
                timeline="April 2024 - Present"
                delay={0.2}
                gradient="bg-gradient-to-tl"
              />

              {/* 10. Letovo SMP */}
              <ProjectCard
                url="https://discord.gg/ex8h77m49X"
                title="Letovo SMP"
                fullDescription={[
                    "Letovo SMP was created to bring the students of Letovo School together in a shared online space, where they could collaborate, compete, and express their creativity. With custom plugins, regular events, and a vibrant community, Letovo SMP quickly became a beloved hub for the school's gamers. Over two years, the server saw incredible builds, survival challenges, and community-driven projects, fostering teamwork and friendly competition. While the server is no longer actively supported, it left a lasting impact on the community, creating memorable experiences for all its participants."
                ]}
                cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169334/lukres.dev/hxqurbpc.png"
                cardDescription="The official Minecraft SMP (Survival Multiplayer) server for Letovo School, offering a creative and competitive environment for students."
                media={[
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169334/lukres.dev/hxqurbpc.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169340/lukres.dev/iqmj4yt9.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169368/lukres.dev/senhgz35.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169371/lukres.dev/szqbp2a5.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169352/lukres.dev/oqjxmafb.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169321/lukres.dev/b80fm686.png",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169263/lukres.dev/0uiqieur.png"
                ]}
                myRole="Co-Founder, Developer, Suport"
                timeline="November 2022 - August 2023"
                delay={0.1}
                gradient="bg-gradient-to-br"
              />

              {/* 11. LuKres.dev */}
              <ProjectCard
                url="https://lukres.dev/home"
                title="LuKres.dev"
                fullDescription={[
                  "LuKres.dev is more than just a personal portfolio—it's a reflection of my journey as a developer. From showcasing my key projects to providing insights through my blog, this site serves as a hub for all things related to my development career. Whether you're looking to explore my work, learn from tutorials, or simply get in touch, LuKres.dev offers a seamless experience. Built with modern web technologies, the site demonstrates my expertise in both front-end and back-end development, while also sharing my passion for cybersecurity, game design, and AI."
                ]}
                cardImage="https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169289/lukres.dev/8fruzhc1.png"
                cardDescription="The personal website of LuKres, showcasing my projects, skills, and a blog dedicated to tech and development insights."
                media={[
                  "https://res.cloudinary.com/dygcwhekh/video/upload/f_auto,q_auto,vc_auto/v1734169276/lukres.dev/5e9892ao.mp4",
                    "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169289/lukres.dev/8fruzhc1.png"
                ]}
                myRole="Founder, Developer"
                timeline="April 2024 - Present"
                delay={0.15}
                gradient="bg-gradient-to-br"
              />
          </ul>
        </section>
      </>
  );
}
