import { NextRequest, NextResponse } from 'next/server'

// 模擬用戶資料（在實際應用中會從資料庫獲取）
const users = [
  { id: 1, name: '張三', email: 'zhang@example.com', role: 'admin' },
  { id: 2, name: '李四', email: 'li@example.com', role: 'user' },
  { id: 3, name: '王五', email: 'wang@example.com', role: 'user' },
  { id: 4, name: '趙六', email: 'zhao@example.com', role: 'moderator' }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id)
  const user = users.find(u => u.id === userId)

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ user })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const userIndex = users.findIndex(u => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, email, role } = body

    // 更新用戶資料
    users[userIndex] = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role })
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: users[userIndex]
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id)
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  const deletedUser = users.splice(userIndex, 1)[0]

  return NextResponse.json({
    message: 'User deleted successfully',
    user: deletedUser
  })
}
