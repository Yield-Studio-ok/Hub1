import { PrismaClient, Role, ProjectType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Create a Founder user if it doesn't exist
  const founderEmail = "admin@yieldstudio.com";
  const founder = await prisma.user.upsert({
    where: { email: founderEmail },
    update: {},
    create: {
      email: founderEmail,
      name: "Yield Studio Admin",
      password: "hashed_password_here", // In a real scenario, this would be properly hashed
      role: Role.FOUNDER,
    },
  });

  console.log(`Created founder user with id: ${founder.id}`);

  // 2. Create a Default Project for Yield Studio
  const project = await prisma.project.create({
    data: {
      name: "Yield Studio Internal",
      type: ProjectType.WEB_APP,
      ownerId: founder.id,
    },
  });

  console.log(`Created default project with id: ${project.id}`);

  // 3. Seed Resources (Assets & Snippets)
  const resources = [
    {
      name: "Color Primario",
      content: "#6366F1",
      type: "code_snippet",
      projectId: project.id,
    },
    {
      name: "Font Import",
      content:
        '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");',
      type: "code_snippet",
      projectId: project.id,
    },
    {
      name: "Logo Principal",
      content: "https://via.placeholder.com/200x60?text=YieldStudio",
      type: "logo",
      projectId: project.id,
    },
    {
      name: "Documentación Next.js",
      content: "https://nextjs.org/docs",
      type: "link",
      projectId: project.id,
    },
  ];

  for (const resource of resources) {
    const createdResource = await prisma.resource.create({
      data: resource,
    });
    console.log(`Created resource: ${createdResource.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
