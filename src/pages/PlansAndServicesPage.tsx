
import { useSpaceStats } from "@/hooks/conexaData";
import { ServiceCategory } from "@/components/PlansAndServices/ServiceCategory";
import { getServiceCategories } from "@/components/PlansAndServices/ServicesData";

export default function PlansAndServicesPage() {
  const spaceStats = useSpaceStats();
  
  // Get service categories with actual available units
  const serviceCategories = getServiceCategories(40); // Default value, could be dynamic
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planos e Serviços</h1>
        <p className="text-gray-500">Conheça todas as opções disponíveis em nosso coworking</p>
      </div>
      
      <div className="space-y-12">
        {serviceCategories.map((category, i) => (
          <ServiceCategory key={i} {...category} />
        ))}
      </div>
    </div>
  );
}
