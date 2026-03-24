import { Button } from '@/components/ui/button'
import { Checkbox, RadioGroup, Switch } from '@/components/ui/form-controls'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Colors, Semantic, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { z } from 'zod'

const formSchema = z
  .object({
    fullName: z.string().min(3, 'Họ và tên ít nhất 3 ký tự').max(50),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
    confirmPassword: z.string(),
    city: z
      .string({
        message: 'Vui lòng chọn thành phố',
      })
      .min(1, 'Vui lòng chọn thành phố'),
    gender: z
      .enum(['male', 'female', 'other'])
      .refine((val) => ['male', 'female', 'other'].includes(val), {
        message: 'Vui lòng chọn giới tính',
      }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với điều khoản',
    }),
    notifications: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

const CITY_OPTIONS: SelectOption[] = [
  {
    label: 'Hà Nội',
    value: 'hn',
    icon: 'location-city',
    description: 'Thủ đô Việt Nam',
  },
  {
    label: 'TP. Hồ Chí Minh',
    value: 'hcm',
    icon: 'apartment',
    description: 'Thành phố lớn nhất',
  },
  {
    label: 'Đà Nẵng',
    value: 'dn',
    icon: 'beach-access',
    description: 'Thành phố đáng sống',
  },
  {
    label: 'Cần Thơ',
    value: 'ct',
    icon: 'directions-boat',
    description: 'Thành phố miền Tây',
  },
  {
    label: 'Hải Phòng',
    value: 'hp',
    icon: 'anchor',
    description: 'Thành phố Hoa Phượng Đỏ',
  },
  { label: 'Huế', value: 'h', icon: 'castle', description: 'Cố đô ngàn năm' },
]

export default function FormDemoScreen() {
  const { theme } = useTheme()
  const c = Colors[theme]

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      city: '',
      gender: undefined,
      acceptTerms: false,
      notifications: true,
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data)
    alert(
      'Đăng ký thành công!\n\nChào mừng ' +
        data.fullName +
        ' đến từ ' +
        CITY_OPTIONS.find((c) => c.value === data.city)?.label,
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: c.text }]}>Đăng ký Tài khoản</Text>

      <Controller
        control={control}
        name='fullName'
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label='Họ và tên'
            placeholder='Nhập họ và tên...'
            required
            leftIcon='person'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.fullName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='email'
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label='Email'
            placeholder='Nhập email...'
            keyboardType='email-address'
            autoCapitalize='none'
            required
            leftIcon='email'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='city'
        render={({ field: { onChange, value } }) => (
          <Select
            label='Thành phố hiện tại *'
            placeholder='Chọn thành phố của bạn'
            options={CITY_OPTIONS}
            value={value}
            onChange={onChange}
            searchable={true}
            error={errors.city?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='password'
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label='Mật khẩu'
            placeholder='Nhập mật khẩu...'
            secureTextEntry
            required
            leftIcon='lock'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='confirmPassword'
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label='Xác nhận mật khẩu'
            placeholder='Nhập lại mật khẩu...'
            secureTextEntry
            required
            leftIcon='lock'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <View style={styles.section}>
        <Controller
          control={control}
          name='gender'
          render={({ field: { onChange, value } }) => (
            <View>
              <RadioGroup
                label='Giới tính *'
                value={value as any}
                onChange={onChange}
                options={[
                  { label: 'Nam', value: 'male' },
                  { label: 'Nữ', value: 'female' },
                  { label: 'Khác', value: 'other' },
                ]}
              />
              {errors.gender && (
                <Text style={[styles.errorText, { color: Semantic.error }]}>
                  {errors.gender.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name='notifications'
          render={({ field: { onChange, value } }) => (
            <Switch
              label='Nhận thông báo qua Email'
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name='acceptTerms'
          render={({ field: { onChange, value } }) => (
            <View>
              <Checkbox
                label='Tôi đồng ý với các điều khoản sử dụng *'
                checked={value}
                onChange={onChange}
              />
              {errors.acceptTerms && (
                <Text style={[styles.errorText, { color: Semantic.error }]}>
                  {errors.acceptTerms.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      <Button
        label='Đăng ký ngay'
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xl * 4,
  },
  title: {
    fontSize: Typography.size['2xl'],
    fontWeight: '700',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.size.xs,
    marginTop: 6,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: Spacing.lg,
    height: 56,
  },
})
