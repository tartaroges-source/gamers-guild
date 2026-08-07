import Image from "next/image";

type OrgItem = {
  position: string;
  name?: string;
  photoUrl?: string | null;
};

function NodeBox({
  position,
  name,
  photoUrl,
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

        ${
          president
            ? "w-[260px] sm:w-[300px] lg:w-[320px] h-[220px] sm:h-[250px] lg:h-[260px]"
            : "w-[220px] sm:w-[260px] lg:w-[280px] h-[200px] sm:h-[220px] lg:h-[230px]"
        }
      `}
    >
      {/* Avatar */}
      <div className="-mt-10 sm:-mt-12">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name ?? position}
            width={140}
            height={140}
            priority
            className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full border-[5px] border-guild-green bg-background object-cover shadow-xl"
          />
        ) : (
          <div className="flex h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 items-center justify-center rounded-full bg-background text-4xl sm:text-5xl font-bold text-guild-green shadow-xl">
            {name ? name.charAt(0) : "?"}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 text-center px-4">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-guild-gold">
          {position}
        </h3>

        <p className="mt-2 sm:mt-4 text-lg sm:text-xl lg:text-2xl font-bold leading-snug text-white">
          {name ?? "Vacant"}
        </p>
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

            <NodeBox position={item.position} name={item.name} photoUrl={item.photoUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}

type ExecutiveOrgChartProps = {
  membersByPosition: Record<
    string,
    {
      name: string;
      photoUrl: string | null;
    } | undefined
  >;
};

export function ExecutiveOrgChart({ membersByPosition }: ExecutiveOrgChartProps) {
  const lookup = (position: string): OrgItem => {
    const match = membersByPosition[position];

    return {
      position,
      name: match?.name,
      photoUrl: match?.photoUrl,
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