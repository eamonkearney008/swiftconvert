'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  slug: string;
  icon: string;
  className?: string;
}

export default function LazyBlogCard({
  title,
  excerpt,
  category,
  readTime,
  date,
  slug,
  icon,
  className = ''
}: BlogCardProps) {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!isInView) {
    return (
      <div ref={cardRef} className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="block">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}
      >
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
            {excerpt}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
          {category}
        </span>
        <div className="flex items-center space-x-3">
          <span>{readTime}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
