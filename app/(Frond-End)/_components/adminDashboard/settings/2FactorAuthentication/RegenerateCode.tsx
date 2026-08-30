import CustomInput from '@/components/reusable/dashboard/CustomInput'
import { useGenerateCodeMutation } from '@/feature/slice/admin/securitySettings'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface FormData {
  password: string
}

export default function GenerateNewCode() {
  const [generateNewCode, { isLoading }] = useGenerateCodeMutation()
  const [showPassword, setShowPassword] = useState(false);
 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
  try {
    const res = await generateNewCode(data).unwrap()
    toast.success(res?.message || "Success")
  } catch (err: any) {
    toast.error(err?.data?.message || "Something went wrong")
  }
}

  return (
    <div className="px-3">
      <p className="mb-6 text-[14px] font-normal leading-[140%] tracking-[0.07px] text-[#4A4C56]">
        Generate 10 backup codes for verification purpose
      </p>

   <div className='relative'>
       <CustomInput
        label="Enter your Password"
        placeholder="***********************"
        type={showPassword?" text" :"password"}
      
        {...register('password', {
          required: 'Password is required',
        })}
      />
 <button onClick={() => setShowPassword(!showPassword)} className='text-end  cursor-pointer absolute right-3 top-10'>
 {showPassword ? <Eye  className="w-5 h-5 text-[#4A4C56]" /> : <EyeOff  className="w-5 h-5 text-[#4A4C56]" />}
 </button>
   </div>
      {errors.password && (
        <p className="text-[14px] font-normal leading-[140%] tracking-[0.07px] text-red-500">
          {errors.password.message}
        </p>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full cursor-pointer rounded-lg bg-primaryColor px-4 py-2 text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}