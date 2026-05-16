"use client";

interface InstructionsSectionProps {
  instructions: string[];
  cookTime: number;
}

export default function InstructionsSection({
  instructions,
  cookTime,
}: InstructionsSectionProps) {
  return (
    <div className="rounded-[12px] border-2 p-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <h2 className="mb-4 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Instructions</h2>
      <ol className="space-y-4">
        {instructions.map((instruction, idx) => (
          <li key={idx} className="flex gap-4">
            <div className="flex-shrink-0">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {idx + 1}
              </div>
            </div>
            <div className="pt-1">
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>{instruction}</p>
            </div>
          </li>
        ))}
      </ol>
      {cookTime && (
        <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-muted-text)' }}>
            Total cooking time: <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{cookTime} minutes</span>
          </p>
        </div>
      )}
    </div>
  );
}
