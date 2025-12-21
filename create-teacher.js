const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('=== Создание первого пользователя (учителя) ===\n')

rl.question('Email учителя: ', (email) => {
  rl.question('Пароль: ', (password) => {
    rl.question('Имя: ', async (name) => {
      try {
        // Проверяем, есть ли уже пользователи
        const userCount = await prisma.user.count()
        if (userCount > 0) {
          console.log('\n⚠️  В базе уже есть пользователи!')
          console.log('Если хотите создать еще одного учителя, используйте панель управления.')
          process.exit(0)
        }

        // Хешируем пароль
        console.log('\nСоздание пользователя...')
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Создаем пользователя
        const user = await prisma.user.create({
          data: {
            email: email.trim(),
            password: hashedPassword,
            name: name.trim() || 'Учитель',
            role: 'teacher'
          }
        })
        
        console.log('\n✅ Учитель успешно создан!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`Email: ${user.email}`)
        console.log(`Имя: ${user.name}`)
        console.log(`Роль: ${user.role}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('\nТеперь вы можете войти на сайт используя эти данные.')
        
      } catch (error) {
        if (error.code === 'P2002') {
          console.error('\n❌ Ошибка: Пользователь с таким email уже существует!')
        } else {
          console.error('\n❌ Ошибка:', error.message)
        }
      } finally {
        await prisma.$disconnect()
        rl.close()
      }
    })
  })
})

