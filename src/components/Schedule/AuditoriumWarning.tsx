
export function AuditoriumWarning() {
  return (
    <div className="bg-amber-50 p-3 rounded-md">
      <p className="text-sm text-amber-800">
        Para o Auditório, as reservas devem seguir um dos formatos:
      </p>
      <ul className="list-disc ml-5 text-sm text-amber-800">
        <li>Meio período manhã: 8h-13h</li>
        <li>Meio período tarde: 13h-19h</li>
        <li>Período completo: 8h-19h</li>
      </ul>
    </div>
  );
}
