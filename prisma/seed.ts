import { prisma } from "../src/configs/database"

async function main() {
  await prisma.status.createMany({
    data: [
      { name: "Planejamento" },
      { name: "Andamento"},
      { name: "Pausa" },
      { name: "Concluído" }
    ]
  })
}

main()
  .then(() => {
    console.log("Registros feitos com sucesso!")
  })
  .catch(e => {
    console.error(e);
    process.exit
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
