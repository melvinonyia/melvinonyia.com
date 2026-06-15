interface ExperienceEntry {
  year: number
  title: string
  company: string
  location: string
}

const EXPERIENCE: readonly ExperienceEntry[] = [
  { year: 2023, title: 'Senior Software Engineer', company: 'MindPrint', location: 'Remote' },
  { year: 2021, title: 'Software Engineer II', company: 'Cerebral', location: 'Remote' },
  { year: 2019, title: 'Software Engineer', company: 'Uchenso', location: 'Remote' },
]

export function AboutView() {
  return (
    <section className="about-section">
      <h2 className="about-headline">
        Driven and inspired by simple & scalable technical design. For the past
        five years I&apos;ve worked on projects that span the fields of
        publishing, foodservice and healthcare.
      </h2>

      <div className="about-body">
        <p>
          Each experience has fortified my belief in creating software that is
          not just highly-performant and secure, but also designed with
          scalability and maintainability at its core.
        </p>
        <p>
          My journey has been an exploration of solving real-world problems
          through the lens of technology. Whether optimizing a publishing
          workflow to enhance user engagement or implementing secure APIs for
          healthcare data, the challenge has always been to build software that
          stands the test of time and adaptability. To this end, I&apos;ve
          worked closely with cross-functional teams, learned to navigate the
          intricacies of different industry requirements, and stayed ahead of
          technology curves.
        </p>
        <p>
          I believe that the key to successful software engineering lies in
          continuous learning and collaboration. That&apos;s why I regularly
          engage with emerging technologies, contribute to open-source
          projects, and take every opportunity to mentor and be mentored.
          It&apos;s not just about writing code; it&apos;s about writing the
          future in a language we all understand.
        </p>
        <p>
          My vision for the future is to continue developing software that
          matters, solving increasingly complex problems, and playing an active
          role in shaping the technology landscape. Whether your challenges
          involve cloud migration, data security, or process automation, I
          bring a proven track record and an unwavering commitment to
          excellence.
        </p>
      </div>

      <div className="about-experience">
        <h3 className="about-experience-headline">Professional Experience</h3>
        <ul className="about-experience-list">
          {EXPERIENCE.map((item) => (
            <li className="about-experience-item" key={`${item.year}-${item.company}`}>
              <p>{item.year}</p>
              <p>{item.title}</p>
              <p>{item.company}</p>
              <p>{item.location}</p>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="about-headline">
        Building software that matters and solving increasingly complex
        problems.
      </h2>

      <div className="about-body">
        <p>
          In today&apos;s rapidly evolving digital landscape, the significance
          of building software that addresses real-world issues cannot be
          overstated. It&apos;s one thing to write code that works; it&apos;s
          another to engineer solutions that make a tangible difference in
          people&apos;s lives and business operations.
        </p>
        <p>
          Over the years, I&apos;ve had the privilege of working on software
          projects that directly impact diverse sectors—from streamlining
          publishing processes to ensure timely and accurate information
          dissemination, to developing secure point-of-sale systems in
          foodservice, and even architecting data-driven healthcare platforms
          that empower clinicians to make informed decisions. Each project has
          been a complex problem-solving endeavor, necessitating not just
          coding skills but also a deep understanding of industry-specific
          challenges and user needs.
        </p>
        <p>
          In this journey, I&apos;ve collaborated with stakeholders from
          multiple disciplines, helping me to see problems from various
          perspectives. It&apos;s this multidimensional approach that has
          enabled me to contribute effectively to solutions that are not just
          technically sound, but also commercially viable and human-centered.
        </p>
        <p>
          My commitment to problem-solving extends to staying updated with the
          latest industry trends, frameworks, and technologies. This perpetual
          learning mindset ensures that the solutions I provide are not just
          relevant today but are geared to adapt to the challenges of
          tomorrow.
        </p>
        <p>
          Whether the task at hand involves leveraging artificial intelligence
          for personalized user experiences or employing blockchain for
          enhanced security, my approach remains the same: building software
          that solves real problems, is reliable, and can adapt to future
          challenges. This is not just my job; it&apos;s my passion.
        </p>
      </div>
    </section>
  )
}
