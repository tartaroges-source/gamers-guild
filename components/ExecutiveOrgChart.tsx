import Image from "next/image";

type OrgItem = {
  position: string;
  name?: string;
  photoUrl?: string | null;
  bio?: string | null;
};

function NodeBox({
  position,
  name,
  photoUrl,
  bio,
  president = false,
}: OrgItem & { president?: boolean }) {
  return (
    <div
      className={`
        relative
        flex
        flex-col
        items-center
        rounded-2xl
        border-2
        border-guild-green/50
        bg-surface
        shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-guild-green
        hover:shadow-green-900/30
        px-4
        pb-5

        ${
          president
            ? "w-[320px] sm:w-[360px] lg:w-[380px] min-h-[290px] sm:min-h-[320px] lg:min-h-[340px]"
            : "w-[270px] sm:w-[310px] lg:w-[330px] min-h-[270px] sm:min-h-[290px] lg:min-h-[310px]"
        }
      `}
    >
      {/* Avatar */}
      <div className="-mt-16 sm:-mt-[72px] lg:-mt-20">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name ?? position}
            width={200}
            height={200}
            priority
            className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full border-[6px] border-guild-green bg-background object-cover object-top shadow-xl"
          />
        ) : (
          <div className="flex h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 items-center justify-center rounded-full bg-background text-4xl sm:text-5xl font-bold text-guild-green shadow-xl">
            {name ? name.charAt(0) : "?"}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 text-center">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-guild-gold">
          {position}
        </h3>

        <p className="mt-2 sm:mt-4 text-lg sm:text-xl lg:text-2xl font-bold leading-snug text-white">
          {name ?? "Vacant"}
        </p>

        {bio && (
          <p className="mt-2 text-xs sm:text-sm leading-snug text-muted">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}

function Stem() {
  return (
    <div className="flex justify-center">
      <div className="h-10 w-[3px] rounded-full bg-guild-green/50" />
    </div>
  );
}

function LevelRow({ items }: { items: OrgItem[] }) {
  return (
    <div className="flex w-full flex-col items-center">
      {/* Horizontal Line */}
      <div className="relative mb-2 h-8 w-full max-w-[900px]">
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-guild-green/40" />
      </div>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
        {items.map((item) => (
          <div key={item.position} className="flex flex-col items-center">
            <div className="h-8 w-[3px] bg-guild-green/50" />

            <NodeBox
              position={item.position}
              name={item.name}
              photoUrl={item.photoUrl}
              bio={item.bio}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type ExecutiveMember = {
  name: string;
  photoUrl: string | null;
  bio?: string | null;
};

type ExecutiveOrgChartProps = {
  membersByPosition: Record<string, ExecutiveMember | undefined>;
};

export function ExecutiveOrgChart({ membersByPosition }: ExecutiveOrgChartProps) {
  const lookup = (position: string): OrgItem => {
    const match = membersByPosition[position];

    return {
      position,
      name: match?.name,
      photoUrl: match?.photoUrl,
      bio: match?.bio,
    };
  };

  return (
    <section className="py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 sm:px-10">
        {/* President */}
        <NodeBox {...lookup("President")} president />

        <Stem />

        {/* Vice Presidents */}
        <LevelRow items={[lookup("VP Internal"), lookup("VP External")]} />

        <Stem />

        {/* Officers */}
        <LevelRow
          items={[
            lookup("Secretary"),
            lookup("Treasurer"),
            lookup("Auditor"),
            lookup("P.R.O"),
          ]}
        />

        <Stem />

        <NodeBox {...lookup("Event Director")} />

        <Stem />

        <NodeBox {...lookup("Team Manager")} />

        <Stem />

        <LevelRow items={[lookup("Promotion Head"), lookup("Technical Head")]} />
      </div>
    </section>
  );
}